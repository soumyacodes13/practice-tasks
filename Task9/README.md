# Simple Cache Layer

## Description

A lightweight in-memory cache for Node.js with support for:

* TTL (Time-To-Live) expiration
* Automatic cleanup of expired entries
* Multiple JavaScript data types
* Cache statistics (hits, misses, hit rate)

## Installation

```bash
git clone <repository-url>
cd task9
npm install
```

If Jest is not installed:

```bash
npm install --save-dev jest
```

## Usage

Run the demo:

```bash
npm start
```

Run the tests:

```bash
npm test
```

Example:

```javascript
const Cache = require('./cache');

const cache = new Cache();

cache.set('user', 'John', 300);
console.log(cache.get('user'));
console.log(cache.has('user'));
console.log(cache.stats());
```

## API

| Method                 | Description                                 |
| ---------------------- | ------------------------------------------- |
| `set(key, value, ttl)` | Store a value with TTL (seconds).           |
| `get(key)`             | Retrieve a value or `undefined`.            |
| `has(key)`             | Check if a valid key exists.                |
| `del(key)`             | Delete a key.                               |
| `clear()`              | Remove all entries.                         |
| `ttl(key, ttl)`        | Update a key's TTL.                         |
| `stats()`              | Return entries, hits, misses, and hit rate. |

## Design

* Uses JavaScript `Map` for O(1) average lookup.
* Stores entries as `{ value, expiresAt }`.
* Supports lazy expiration and automatic background cleanup.
* Tracks cache hits, misses, and hit rate.

## Complexity

| Operation                                  | Time |
| ------------------------------------------ | ---- |
| `set`, `get`, `has`, `del`, `ttl`, `stats` | O(1) |
| `clear`, cleanup                           | O(N) |
