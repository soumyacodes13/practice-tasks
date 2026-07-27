'use strict';

const fs   = require('fs');
const path = require('path');
const { interpolate }  = require('./interpolator');
const { validate }     = require('./validator');

class ConfigManager {
    constructor() {
        /** Holds the raw (pre-interpolation) config loaded from disk. */
        this._raw = {};
        /** Holds the interpolated working copy. */
        this._data = {};
    }

    // ── Public API ────────────────────────────────────────────────────────────

    /**
     * Load configuration from a JSON file.
     * Performs environment variable interpolation immediately after parsing.
     *
     * @param {string} filePath - Absolute or relative path to a JSON file.
     * @throws {Error} If the file is missing or contains invalid JSON.
     */
    load(filePath) {
        const resolved = path.resolve(filePath);
        this._raw  = this._readFile(resolved);
        this._data = this._interpolateEnv(this._raw);
        return this; // allow chaining
    }

    /**
     * Get a value by dot-notation path.
     *
     * @param {string} dotPath      - e.g. 'database.host'
     * @param {*}      [defaultVal] - Returned when the key does not exist.
     * @returns {*}
     */
    get(dotPath, defaultVal = undefined) {
        const value = this._getNestedValue(this._data, dotPath.split('.'));
        return value === undefined ? defaultVal : value;
    }

    /**
     * Set a value at a dot-notation path.
     * Creates intermediate objects as needed.
     *
     * @param {string} dotPath - e.g. 'database.port'
     * @param {*}      value
     */
    set(dotPath, value) {
        this._setNestedValue(this._data, dotPath.split('.'), value);
        return this; // allow chaining
    }

    /**
     * Validate the current (interpolated) config against a schema.
     *
     * @param {object} schema
     * @returns {{ valid: boolean, errors: string[] }}
     */
    validate(schema) {
        return validate(this._data, schema);
    }

    // ── Internal helpers ──────────────────────────────────────────────────────

    /**
     * Read and parse a JSON file from disk.
     * @param {string} filePath - Absolute path.
     * @returns {object}
     */
    _readFile(filePath) {
        let raw;
        try {
            raw = fs.readFileSync(filePath, 'utf8');
        } catch (err) {
            throw new Error(`ConfigManager: cannot read file "${filePath}": ${err.message}`);
        }

        let parsed;
        try {
            parsed = JSON.parse(raw);
        } catch (err) {
            throw new Error(`ConfigManager: invalid JSON in "${filePath}": ${err.message}`);
        }

        return parsed;
    }

    /**
     * Apply environment variable interpolation to every string in the config.
     * @param {*} data
     * @returns {*}
     */
    _interpolateEnv(data) {
        return interpolate(data);
    }

    /**
     * Traverse a nested object by an array of key segments.
     * Returns `undefined` if any segment is missing.
     *
     * @param {object}   obj  - The object to traverse.
     * @param {string[]} keys - Key segments.
     * @returns {*}
     */
    _getNestedValue(obj, keys) {
        let current = obj;
        for (const key of keys) {
            if (current == null || typeof current !== 'object') return undefined;
            current = current[key];
        }
        return current;
    }

    /**
     * Set a value at a nested path, creating intermediate objects when needed.
     *
     * @param {object}   obj   - The object to mutate.
     * @param {string[]} keys  - Key segments.
     * @param {*}        value - Value to assign.
     */
    _setNestedValue(obj, keys, value) {
        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (current[key] == null || typeof current[key] !== 'object') {
                current[key] = {};
            }
            current = current[key];
        }
        current[keys[keys.length - 1]] = value;
    }
}

module.exports = ConfigManager;
