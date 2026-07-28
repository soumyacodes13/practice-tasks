export class EventEmitter {
    constructor() {
        // Map to store event names to an array of listener objects
        this.events = new Map();
    }

    /**
     * Register a persistent event listener
     * @param {string} eventName - The event name or wildcard pattern
     * @param {Function} handler - The callback function
     */
    on(eventName, handler) {
        if (typeof handler !== 'function') {
            throw new TypeError('Handler must be a function');
        }

        if (!this.events.has(eventName)) {
            this.events.set(eventName, []);
        }

        this.events.get(eventName).push({
            handler,
            isOnce: false
        });

        return this; // Enable chaining
    }

    /**
     * Register a one-time event listener that automatically unbinds after execution
     * @param {string} eventName - The event name or wildcard pattern
     * @param {Function} handler - The callback function
     */
    once(eventName, handler) {
        if (typeof handler !== 'function') {
            throw new TypeError('Handler must be a function');
        }

        if (!this.events.has(eventName)) {
            this.events.set(eventName, []);
        }

        this.events.get(eventName).push({
            handler,
            isOnce: true
        });

        return this;
    }

    /**
     * Remove a specific listener from an event
     * @param {string} eventName - The event name or wildcard pattern
     * @param {Function} handler - The original callback function reference
     */
    off(eventName, handler) {
        if (!this.events.has(eventName)) return this;

        const listeners = this.events.get(eventName);
        const filtered = listeners.filter(listener => listener.handler !== handler);

        if (filtered.length === 0) {
            this.events.delete(eventName);
        } else {
            this.events.set(eventName, filtered);
        }

        return this;
    }

    /**
     * Emit an event, executing all matching listeners (exact + wildcard)
     * @param {string} eventName - The name of the event being triggered
     * @param {*} data - Data payload to pass to handlers
     * @returns {Promise<Array>} Resolves with results/statuses of all handlers
     */
    async emit(eventName, data) {
        const matchedListeners = [];

        // Evaluate all registered keys for exact matches or wildcard compatibility
        for (const [pattern, listeners] of this.events.entries()) {
            if (this._matchPattern(pattern, eventName)) {
                // Clone listeners to snapshot current registrations
                matchedListeners.push(...listeners);
            }
        }

        if (matchedListeners.length === 0) {
            return [];
        }

        // Identify and immediately purge 'once' listeners to prevent duplicate triggers
        // if the same event fires recursively inside a handler
        const executionQueue = matchedListeners.map(listener => {
            if (listener.isOnce) {
                this.off(this._findKeyForListener(listener), listener.handler);
            }
            return listener.handler;
        });

        // Execute all handlers concurrently with error isolation using Promise.allSettled
        const promises = executionQueue.map(async (handler) => {
            try {
                return await handler(data);
            } catch (error) {
                // Isolate handler failures so one crash doesn't halt the pipeline
                throw error;
            }
        });

        return Promise.allSettled(promises);
    }

    /**
     * Helper to match standard wildcards (e.g., 'user.*' matches 'user.created')
     * @private
     */
    _matchPattern(pattern, eventName) {
        if (pattern === eventName) return true;
        
        // Helper to convert wildcard pattern to regex
        const toRegex = (str) => {
            return new RegExp('^' + str.split('*').map(this._escapeRegExp).join('.*') + '$');
        };

        if (pattern.includes('*') && toRegex(pattern).test(eventName)) {
            return true;
        }

        if (eventName.includes('*') && toRegex(eventName).test(pattern)) {
            return true;
        }

        return false;
    }

    /**
     * Helper to escape special regex characters in event strings
     * @private
     */
    _escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Helper to locate the key holding a specific listener object (used for 'once' cleanup)
     * @private
     */
    _findKeyForListener(targetListener) {
        for (const [key, listeners] of this.events.entries()) {
            if (listeners.includes(targetListener)) {
                return key;
            }
        }
        return null;
    }
}
