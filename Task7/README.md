# Rate Limiting Middleware

A lightweight Node.js rate limiting middleware that limits requests per IP address within a configurable time window. It supports configurable request limits, automatic window resets, standard rate-limit headers, `429 Too Many Requests` responses, and periodic cleanup of expired records to keep memory usage bounded.

## Installation

### Requirements

- Node.js 16+
- npm

Verify your installation:

```bash
node -v
npm -v
```

Install dependencies:

```bash
npm install
```

## Usage

Start the demo server:

```bash
npm start
```

Run the test suite:

```bash
npm test
```

The demo server runs at:

```
http://localhost:3000
```

Example middleware:

```javascript
const rateLimit = require('./rateLimiter');

const limiter = rateLimit({
    windowMs: 60000,
    max: 100
});

app.use(limiter);
```