
# API Time Machine ⏪

Record, replay and simulate HTTP API responses.

API Time Machine is a lightweight JavaScript developer tool that
allows you to capture API responses, replay them without internet
access, and simulate network conditions.

## Features

- Record HTTP API responses
- Replay previously recorded responses
- Offline API testing
- Local JSON-based storage
- Request matching using method, URL and body
- Simulate network latency
- Simulate network failures
- Compare JSON responses
- CLI recording management
- Sensitive response-header redaction

## Installation

```bash
npm install api-time-machine
```

## Quick Start

```js
import { createTimeMachine } from "api-time-machine";

const atm = createTimeMachine({
  mode: "RECORD"
});

const response = await atm.fetch(
  "https://jsonplaceholder.typicode.com/users"
);

const users = await response.json();

console.log(users);
```

## Available Modes

### RECORD

Captures real API responses and saves them locally.

```js
const atm = createTimeMachine({
  mode: "RECORD"
});
```

### REPLAY

Returns previously recorded responses without
making an external network request.

```js
const atm = createTimeMachine({
  mode: "REPLAY"
});
```

### SIMULATE

Simulates network latency and random network failures
while making real API requests.

```js
const atm = createTimeMachine({
  mode: "SIMULATE",
  latency: 2000,
  failureRate: 0.3
});
```

## Compare API Responses

```js
import { compareJSON } from "api-time-machine";

const changes = compareJSON(
  { name: "Adi", age: 18 },
  { name: "Aditya", email: "adi@example.com" }
);

console.log(changes);
```

## CLI Commands

```bash
atm list
atm inspect <recording-id>
atm clear
```

## Tech Stack

- JavaScript
- Node.js
- Native Fetch API
- Commander.js
- Vitest
- JSON File Storage

## Project Structure

```text
src/
  core/
  storage/
  simulation/
  cli/
  utils/
  index.js

tests/
examples/
recordings/
```

## Use Cases

- Offline frontend development
- API debugging
- Reproducible testing
- Testing slow network conditions
- Testing network failures
- Comparing API response changes

## License

MIT