
import { createTimeMachine } from "../src/index.js";

const atm = createTimeMachine({
  mode: "REPLAY"
});

try {
  const response = await atm.fetch(
    "https://jsonplaceholder.typicode.com/users"
  );

  const users = await response.json();

  console.log("OFFLINE REPLAY SUCCESS!");
  console.log("Users retrieved:", users.length);
} catch (error) {
  console.error("Replay failed:", error.message);
}
