/**
 * Rate Limiting Middleware
 *
 * Limits API requests per configurable time window, tracked by IP address.
 * Expired records are cleaned up periodically to keep memory bounded.
 *
 * Usage:
 *   const rateLimit = require('./rateLimiter');
 *   app.use(rateLimit({ windowMs: 60000, max: 100 }));
 */
function rateLimit(options = {}) {
    const {
        windowMs = 60 * 1000,   // default: 1 minute
        max = 100,              // default: 100 requests per window
        cleanupIntervalMs = windowMs // how often to purge stale records
    } = options;

    // Map<ip, { count, resetTime }>
    const store = new Map();

    // Periodically remove records whose window has already expired.
    // This keeps memory bounded when many different IPs are seen over time.
    const cleanup = setInterval(() => {
        const now = Date.now();
        for (const [ip, record] of store) {
            if (now > record.resetTime) {
                store.delete(ip);
            }
        }
    }, cleanupIntervalMs);

    // Allow the interval to be garbage-collected when the process has nothing
    // else to keep it alive (e.g. in tests).
    if (cleanup.unref) cleanup.unref();

    /**
     * The actual Express-compatible middleware function.
     * @param {object} req
     * @param {object} res
     * @param {Function} next
     */
    function middleware(req, res, next) {
        const ip = req.ip
            || (req.connection && req.connection.remoteAddress)
            || 'unknown';
        const now = Date.now();

        let record = store.get(ip);

        // Start a fresh window if none exists or the previous one expired.
        if (!record || now > record.resetTime) {
            record = { count: 0, resetTime: now + windowMs };
        }

        record.count++;
        store.set(ip, record);

        const remaining  = Math.max(0, max - record.count);
        const resetSecs  = Math.ceil(record.resetTime / 1000);
        const retryAfter = Math.ceil((record.resetTime - now) / 1000);

        res.setHeader('X-RateLimit-Limit',     max);
        res.setHeader('X-RateLimit-Remaining', remaining);
        res.setHeader('X-RateLimit-Reset',     resetSecs);

        if (record.count > max) {
            res.setHeader('Retry-After', retryAfter);
            return res.status(429).json({
                error: 'Too Many Requests',
                message: 'Rate limit exceeded. Please try again later.',
                retryAfter
            });
        }

        next();
    }

    /**
     * Stop the background cleanup timer.
     * Useful in tests or when tearing down the server.
     */
    middleware.destroy = () => clearInterval(cleanup);

    /**
     * Expose the internal store for testing / inspection.
     */
    middleware.store = store;

    return middleware;
}

module.exports = rateLimit;
