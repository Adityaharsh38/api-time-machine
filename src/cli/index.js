#!/usr/bin/env node

import { Command } from "commander";
import { JSONStorage } from "../storage/json-storage.js";

const program = new Command();

const storage = new JSONStorage();

program
  .name("atm")
  .description("API Time Machine - Record, replay and simulate API responses")
  .version("1.0.0");

program
  .command("list")
  .description("List all saved API recordings")
  .action(async () => {
    const recordings = await storage.list();

    if (!recordings.length) {
      console.log("No recordings found.");
      return;
    }

    console.table(
      recordings.map(recording => ({
        ID: recording.id.slice(0, 8),
        Method: recording.method,
        URL: recording.url,
        Status: recording.status,
        Date: recording.recordedAt
      }))
    );
  });

program
  .command("inspect <id>")
  .description("Inspect a saved recording")
  .action(async (id) => {
    const recordings = await storage.list();

    const recording = recordings.find(
      item => item.id === id || item.id.startsWith(id)
    );

    if (!recording) {
      console.error("Recording not found.");
      process.exitCode = 1;
      return;
    }

    console.log(JSON.stringify(recording, null, 2));
  });

program
  .command("clear")
  .description("Delete all recordings")
  .action(async () => {
    await storage.clear();
    console.log("All recordings cleared.");
  });

program.parseAsync(process.argv).catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
