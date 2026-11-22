
import { compareJSON } from "../src/index.js";

const oldResponse = {
  id: 1,
  name: "Adi",
  age: 18,
  address: {
    city: "Delhi"
  }
};

const newResponse = {
  id: 1,
  name: "Aditya",
  email: "adi@example.com",
  address: {
    city: "Sonipat"
  }
};

const changes = compareJSON(oldResponse, newResponse);

console.log("\nAPI RESPONSE COMPARISON\n");

if (changes.length === 0) {
  console.log("No changes detected.");
} else {
  for (const change of changes) {
    console.log(`[${change.type}] ${change.path}`);

    if (change.type === "MODIFIED") {
      console.log("  Old:", change.oldValue);
      console.log("  New:", change.newValue);
    }

    if (change.type === "ADDED") {
      console.log("  Value:", change.newValue);
    }

    if (change.type === "REMOVED") {
      console.log("  Previous value:", change.oldValue);
    }
  }
}

console.log(`\nTotal changes: ${changes.length}`);
