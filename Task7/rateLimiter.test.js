/**
 * Test suite for the Rate Limiter middleware.
 *
 * Run with:  npm test
 */
const rateLimit = require('./rateLimiter');

// ---------- helpers ----------

/** Build a minimal mock req object. */
function makeReq(ip = '127.0.0.1') {
    return { ip, connection: { remoteAddress: ip } };
}

/** Build a mock res that records headers and the final status/body. */
function makeRes() {
    const headers = {};
    const res = {
        headers,
        statusCode: 200,
        body: null,
        setHeader(name, value) { headers[name] = value; },
        status(code) { this.statusCode = code; return this; },
        json(data) { this.body = data; return this; }
    };
    return res;
}

// ---------- tests ----------

describe('rateLimit middleware', () => {
    let limiter;

    beforeEach(() => {
        // Fresh limiter for every test: tiny window, max 3 requests.
        limiter = rateLimit({ windowMs: 200, max: 3 });
    });

    afterEach(() => {
        limiter.destroy(); // stop the cleanup timer
    });

    // -- Header correctness --

    test('sets X-RateLimit-Limit header', () => {
        const res = makeRes();
        limiter(makeReq(), res, () => {});
        expect(res.headers['X-RateLimit-Limit']).toBe(3);
    });

    test('sets X-RateLimit-Remaining header correctly', () => {
        const res1 = makeRes();
        const res2 = makeRes();
        const req  = makeReq();

        limiter(req, res1, () => {});
        limiter(req, res2, () => {});

        expect(res1.headers['X-RateLimit-Remaining']).toBe(2);
        expect(res2.headers['X-RateLimit-Remaining']).toBe(1);
    });

    test('sets X-RateLimit-Reset to a Unix timestamp in seconds', () => {
        const before = Math.floor(Date.now() / 1000);
        const res    = makeRes();
        limiter(makeReq(), res, () => {});
        const after  = Math.ceil((Date.now() + 200) / 1000);

        expect(res.headers['X-RateLimit-Reset']).toBeGreaterThanOrEqual(before);
        expect(res.headers['X-RateLimit-Reset']).toBeLessThanOrEqual(after);
    });

    // -- Request counting --

    test('allows requests within the limit', () => {
        const req = makeReq();
        let nextCalled = 0;

        for (let i = 0; i < 3; i++) {
            limiter(req, makeRes(), () => { nextCalled++; });
        }

        expect(nextCalled).toBe(3);
    });

    test('blocks request that exceeds the limit', () => {
        const req = makeReq();
        let lastRes;

        for (let i = 0; i < 4; i++) {
            lastRes = makeRes();
            limiter(req, lastRes, () => {});
        }

        expect(lastRes.statusCode).toBe(429);
        expect(lastRes.body.error).toBe('Too Many Requests');
    });

    test('sets Retry-After header when blocked', () => {
        const req = makeReq();

        for (let i = 0; i < 4; i++) {
            const res = makeRes();
            limiter(req, res, () => {});
            if (i === 3) {
                expect(res.headers['Retry-After']).toBeGreaterThan(0);
            }
        }
    });

    test('X-RateLimit-Remaining never goes below 0', () => {
        const req = makeReq();

        for (let i = 0; i < 6; i++) {
            const res = makeRes();
            limiter(req, res, () => {});
            expect(res.headers['X-RateLimit-Remaining']).toBeGreaterThanOrEqual(0);
        }
    });

    // -- IP isolation --

    test('tracks different IPs independently', () => {
        const reqA = makeReq('10.0.0.1');
        const reqB = makeReq('10.0.0.2');
        let nextCount = 0;

        // Exhaust IP A's limit
        for (let i = 0; i < 4; i++) {
            limiter(reqA, makeRes(), () => { nextCount++; });
        }

        // IP B should still be allowed
        const resB = makeRes();
        limiter(reqB, resB, () => { nextCount++; });

        expect(resB.statusCode).toBe(200);
        expect(nextCount).toBe(4); // 3 from A + 1 from B
    });

    // -- Window reset --

    test('resets counter after the window expires', async () => {
        const req = makeReq('192.168.1.1');

        // Exhaust the limit
        for (let i = 0; i < 4; i++) {
            limiter(req, makeRes(), () => {});
        }

        // Wait for the window to expire (200 ms + small buffer)
        await new Promise(r => setTimeout(r, 250));

        const res = makeRes();
        let nextCalled = false;
        limiter(req, res, () => { nextCalled = true; });

        expect(nextCalled).toBe(true);
        expect(res.headers['X-RateLimit-Remaining']).toBe(2); // max - 1 = 2
    });

    // -- Default options --

    test('uses default windowMs and max when no options provided', () => {
        const defaultLimiter = rateLimit();
        const res = makeRes();
        defaultLimiter(makeReq(), res, () => {});
        expect(res.headers['X-RateLimit-Limit']).toBe(100);
        defaultLimiter.destroy();
    });

    // -- Fallback IP --

    test('falls back to connection.remoteAddress when req.ip is absent', () => {
        const req = { connection: { remoteAddress: '5.5.5.5' } }; // no req.ip
        const res = makeRes();
        limiter(req, res, () => {});
        expect(res.headers['X-RateLimit-Limit']).toBe(3);
        // Store should have recorded the connection address
        expect(limiter.store.has('5.5.5.5')).toBe(true);
    });
});
