
import { JSONStorage } from "../storage/json-storage.js";
import { createRequestKey } from "./matcher.js";
import { sanitizeHeaders } from "../utils/sanitize.js";
import { randomUUID } from "node:crypto";

const MODES = ["RECORD", "REPLAY", "SIMULATE"];

export class TimeMachine {
  constructor(options = {}) {
    const {
      mode = "RECORD",
      storagePath = "recordings/recordings.json",
      latency = 0,
      failureRate = 0,
      redactHeaders = []
    } = options;

    if (!MODES.includes(mode)) {
      throw new Error(`Invalid mode: ${mode}`);
    }

    if (latency < 0) {
      throw new Error("Latency cannot be negative.");
    }

    if (failureRate < 0 || failureRate > 1) {
      throw new Error("failureRate must be between 0 and 1.");
    }

    this.mode = mode;
    this.storage = new JSONStorage(storagePath);
    this.latency = latency;
    this.failureRate = failureRate;
    this.redactHeaders = redactHeaders.map(h => h.toLowerCase());
  }

  async fetch(input, init = {}) {
    const request = new Request(input, init);
    const requestBody = await request.clone().text();

    const key = createRequestKey(request, requestBody);

    if (this.mode === "REPLAY") {
      return this.replay(key);
    }

    if (this.mode === "SIMULATE") {
      return this.simulate(request);
    }

    return this.record(request, key);
  }

  async record(request, key) {
    const response = await globalThis.fetch(request.clone());

    const body = await response.clone().text();

    const headers = sanitizeHeaders(response.headers);

    for (const header of this.redactHeaders) {
      if (header in headers) {
        headers[header] = "[REDACTED]";
      }
    }

    const recording = {
      id: randomUUID(),
      key,
      method: request.method,
      url: request.url,
      status: response.status,
      statusText: response.statusText,
      headers,
      body,
      recordedAt: new Date().toISOString()
    };

    await this.storage.add(recording);

    return response;
  }

  async replay(key) {
    const recording = await this.storage.find(key);

    if (!recording) {
      throw new Error(
        "No matching recording found. Run the request in RECORD mode first."
      );
    }

    const body = [204, 205, 304].includes(recording.status)
  ? null
  : recording.body;

return new Response(body, {
  status: recording.status,
  statusText: recording.statusText,
  headers: recording.headers
});
  }

  async simulate(request) {
    if (this.latency > 0) {
      await new Promise(resolve =>
        setTimeout(resolve, this.latency)
      );
    }

    if (Math.random() < this.failureRate) {
      throw new TypeError(
        "Simulated network failure by API Time Machine."
      );
    }

    return globalThis.fetch(request);
  }
}
