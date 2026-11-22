
import { createTimeMachine } from "../src/index.js";

const URL = "https://jsonplaceholder.typicode.com/users";

// STEP 1: RECORD
console.log("\n--- RECORD MODE ---");

const recorder = createTimeMachine({
  mode: "RECORD"
});

const recordedResponse = await recorder.fetch(URL);
const recordedUsers = await recordedResponse.json();

console.log("Recorded users:", recordedUsers.length);

// STEP 2: REPLAY
console.log("\n--- REPLAY MODE ---");

const replayer = createTimeMachine({
  mode: "REPLAY"
});

const replayedResponse = await replayer.fetch(URL);
const replayedUsers = await replayedResponse.json();

console.log("Replayed users:", replayedUsers.length);

// STEP 3: SIMULATE
console.log("\n--- SIMULATE MODE ---");

const simulator = createTimeMachine({
  mode: "SIMULATE",
  latency: 1000,
  failureRate: 0
});

const start = Date.now();

const simulatedResponse = await simulator.fetch(URL);

console.log("Status:", simulatedResponse.status);
console.log("Time taken:", Date.now() - start, "ms");

console.log("\nAPI TIME MACHINE WORKING!");
