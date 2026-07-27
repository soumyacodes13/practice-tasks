
const http   = require('http');
const rateLimit = require('./rateLimiter');

// ── Example 1: standard per-IP limit ─────────────────────────────────────────
const apiLimiter = rateLimit({
    windowMs: 60_000, // 1 minute
    max: 5            // low limit so you can see it in action quickly
});

// ── Minimal mock server (no Express needed) ───────────────────────────────────
const server = http.createServer((req, res) => {
    // Attach helpers so our middleware can call res.setHeader / res.status / res.json
    res.status = (code) => { res.statusCode = code; return res; };
    res.json   = (data) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
    };

    apiLimiter(req, res, () => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Hello! Request accepted.' }));
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`\nRate-limiter demo running on http://localhost:${PORT}`);
    console.log('Send 6+ rapid requests to see the 429 response.\n');
    console.log('Quick test with curl:');
    console.log(`  for i in {1..7}; do curl -si http://localhost:${PORT} | grep -E "HTTP|X-Rate|Retry"; echo; done\n`);
});
