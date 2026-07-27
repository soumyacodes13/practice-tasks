'use strict';

class Cache {
    constructor(cleanupInterval = 60000) {
        // Stores cache entries
        // Structure:
        // Map {
        //   "key" => {
        //      value: <any>,
        //      expiresAt: <timestamp>
        //   }
        // }
        this.store = new Map();

        // Cache statistics
        this.hits = 0;
        this.misses = 0;

        // Automatically clean expired entries every minute
        this.cleanupTimer = setInterval(() => {
            this._cleanupExpired();
        }, cleanupInterval);
    }

    // ============================
    // Public API
    // ============================

    set(key, value, ttl) {
        const expiresAt = Date.now() + (ttl * 1000);

        this.store.set(key, {
            value,
            expiresAt
        });
    }

    get(key) {
        if (this._deleteIfExpired(key)) {
            this.misses++;
            return undefined;
        }

        const entry = this.store.get(key);

        if (!entry) {
            this.misses++;
            return undefined;
        }

        this.hits++;
        return entry.value;
    }

    has(key) {
    if (this._deleteIfExpired(key)) {
        this.misses++;
        return false;
    }

    return this.store.has(key);
}

    del(key) {
        return this.store.delete(key);
    }

    clear() {
        this.store.clear();
    }

    ttl(key, ttl) {
        if (this._deleteIfExpired(key)) {
            return false;
        }

        const entry = this.store.get(key);

        if (!entry) {
            return false;
        }

        entry.expiresAt = Date.now() + (ttl * 1000);

        return true;
    }

    stats() {
        const totalRequests = this.hits + this.misses;

        return {
            entries: this.store.size,
            hits: this.hits,
            misses: this.misses,
            hitRate: totalRequests === 0
                ? 0
                : Number(((this.hits / totalRequests) * 100).toFixed(2))
        };
    }

    // Optional:
    // Allows tests or applications to stop the cleanup timer.
    destroy() {
        clearInterval(this.cleanupTimer);
    }

    // ============================
    // Internal Helper Methods
    // ============================

    _isExpired(entry) {
        return Date.now() >= entry.expiresAt;
    }

    _deleteIfExpired(key) {
        const entry = this.store.get(key);

        if (!entry) {
            return false;
        }

        if (this._isExpired(entry)) {
            this.store.delete(key);
            return true;
        }

        return false;
    }

    _cleanupExpired() {
        for (const [key, entry] of this.store.entries()) {
            if (this._isExpired(entry)) {
                this.store.delete(key);
            }
        }
    }
}

module.exports = Cache;