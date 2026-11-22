
import fs from "node:fs/promises";
import path from "node:path";

export class JSONStorage {
  constructor(filePath = "recordings/recordings.json") {
    this.filePath = path.resolve(filePath);
  }

  async read() {
    try {
      const data = await fs.readFile(this.filePath, "utf8");
      const parsed = JSON.parse(data);

      if (!Array.isArray(parsed)) {
        throw new Error("Invalid recordings file format.");
      }

      return parsed;
    } catch (error) {
      if (error.code === "ENOENT") {
        return [];
      }

      throw error;
    }
  }

  async write(recordings) {
    await fs.mkdir(path.dirname(this.filePath), {
      recursive: true
    });

    await fs.writeFile(
      this.filePath,
      JSON.stringify(recordings, null, 2),
      "utf8"
    );
  }

  async add(recording) {
    const recordings = await this.read();

    recordings.push(recording);

    await this.write(recordings);

    return recording;
  }

  async find(key) {
    const recordings = await this.read();

    return recordings.find(
      (recording) => recording.key === key
    ) || null;
  }

  async list() {
    return this.read();
  }

  async clear() {
    await this.write([]);
  }
}
