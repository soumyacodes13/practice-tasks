# Task 11: Event Emitter System

Pub-Sub event emitter implementation supporting:
* Persistent (`on`) and single-use (`once`) event listeners.
* Unsubscribing (`off`).
* Concurrent async callback resolution.
* Isolated error propagation.
* Bidirectional wildcard match support (e.g. subscribing or emitting with `*`).

## Run Tests
From the project root directory:
```bash
npm run test:t11
```
