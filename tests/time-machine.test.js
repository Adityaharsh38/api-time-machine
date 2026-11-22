
import { describe, it, expect, vi, afterEach } from "vitest";
import { createTimeMachine } from "../src/index.js";
import fs from "node:fs/promises";
import { compareJSON } from "../src/index.js";

const storagePath = "tests/temp-recordings.json";

afterEach(async () => {
  vi.restoreAllMocks();
  await fs.rm(storagePath, { force: true });
});

describe("API Time Machine", () => {
  it("should record an API response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify([{ id: 1 }]), {
          status: 200,
          headers: { "content-type": "application/json" }
        })
      )
    );

    const atm = createTimeMachine({
      mode: "RECORD",
      storagePath
    });

    const response = await atm.fetch("https://test.com/users");

    expect(response.status).toBe(200);

    const recordings = JSON.parse(
      await fs.readFile(storagePath, "utf8")
    );

    expect(recordings).toHaveLength(1);
    expect(recordings[0].body).toContain('"id":1');
  });

  it("should replay a saved response without calling fetch", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify([{ id: 1 }]), {
          status: 200
        })
      )
    );

    const recorder = createTimeMachine({
      mode: "RECORD",
      storagePath
    });

    await recorder.fetch("https://test.com/users");

    const fetchMock = vi.fn();

    vi.stubGlobal("fetch", fetchMock);

    const replayer = createTimeMachine({
      mode: "REPLAY",
      storagePath
    });

    const response = await replayer.fetch(
      "https://test.com/users"
    );

    const data = await response.json();

    expect(data).toEqual([{ id: 1 }]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("should fail when no recording exists", async () => {
    const atm = createTimeMachine({
      mode: "REPLAY",
      storagePath
    });

    await expect(
      atm.fetch("https://missing.com")
    ).rejects.toThrow("No matching recording found");
  });

  it("should simulate network failures", async () => {
    const atm = createTimeMachine({
      mode: "SIMULATE",
      failureRate: 1
    });

    await expect(
      atm.fetch("https://test.com")
    ).rejects.toThrow("Simulated network failure");
  });

  it("should simulate latency", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("OK")
      )
    );

    const atm = createTimeMachine({
      mode: "SIMULATE",
      latency: 100
    });

    const start = Date.now();

    await atm.fetch("https://test.com");

    expect(Date.now() - start).toBeGreaterThanOrEqual(90);
  });
});

describe("JSON Response Comparison", () => {
  it("should detect added fields", () => {
    const changes = compareJSON(
      { name: "Adi" },
      { name: "Adi", age: 19 }
    );

    expect(changes).toHaveLength(1);
    expect(changes[0].type).toBe("ADDED");
  });

  it("should detect removed fields", () => {
    const changes = compareJSON(
      { name: "Adi", age: 19 },
      { name: "Adi" }
    );

    expect(changes[0].type).toBe("REMOVED");
  });

  it("should detect modified nested fields", () => {
    const changes = compareJSON(
      { user: { city: "Delhi" } },
      { user: { city: "Sonipat" } }
    );

    expect(changes[0].path).toBe("user.city");
    expect(changes[0].type).toBe("MODIFIED");
  });

  it("should return empty array for identical objects", () => {
    const changes = compareJSON(
      { name: "Adi" },
      { name: "Adi" }
    );

    expect(changes).toHaveLength(0);
  });
});
