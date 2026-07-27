'use strict';

/**
 * Replaces all ${VAR_NAME} placeholders in a string with the corresponding
 * value from process.env.  Placeholders with no matching env var are left as-is.
 *
 * @param {string} str  - The template string to interpolate.
 * @returns {string}
 */
function interpolateString(str) {
    return str.replace(/\$\{([^}]+)\}/g, (match, varName) => {
        return Object.prototype.hasOwnProperty.call(process.env, varName)
            ? process.env[varName]
            : match; // leave unresolved placeholder intact
    });
}

/**
 * Recursively walks an object and interpolates every string value.
 *
 * @param {*} value - Any JSON-compatible value.
 * @returns {*}     - The same structure with strings interpolated.
 */
function interpolate(value) {
    if (typeof value === 'string') return interpolateString(value);
    if (Array.isArray(value))     return value.map(interpolate);
    if (value !== null && typeof value === 'object') {
        const result = {};
        for (const key of Object.keys(value)) {
            result[key] = interpolate(value[key]);
        }
        return result;
    }
    return value; // number, boolean, null — nothing to do
}

module.exports = { interpolate, interpolateString };
