
import { TimeMachine } from "./core/time-machine.js";

export function createTimeMachine(options = {}) {
  return new TimeMachine(options);
}

export { TimeMachine };
export { JSONStorage } from "./storage/json-storage.js";
export { createRequestKey } from "./core/matcher.js";
export { compareJSON } from "./core/diff.js";