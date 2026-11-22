
import { createHash } from "node:crypto";

export function createRequestKey(request, body = "") {
  const normalized = JSON.stringify({
    method: request.method.toUpperCase(),
    url: request.url,
    body
  });

  return createHash("sha256")
    .update(normalized)
    .digest("hex");
}

export function findMatchingRecording(recordings, key) {
  return recordings.find(
    (recording) => recording.key === key
  );
}
