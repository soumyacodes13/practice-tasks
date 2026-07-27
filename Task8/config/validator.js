'use strict';

/**
 * Validates a plain config object against a simple schema.
 *
 * Schema format (mirrors the task PRD):
 * {
 *   database: {
 *     host: 'string',
 *     port: 'number',
 *     name: 'string'
 *   },
 *   debug: 'boolean'
 * }
 *
 * Leaf values in the schema are type strings ('string', 'number', 'boolean', 'object', 'array').
 * Nested objects in the schema describe nested config objects.
 *
 * @param {object} config  - The config object to validate.
 * @param {object} schema  - The schema to validate against.
 * @param {string} [prefix] - Dot-path prefix used for error messages (internal).
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validate(config, schema, prefix = '') {
    const errors = [];

    for (const key of Object.keys(schema)) {
        const fullPath    = prefix ? `${prefix}.${key}` : key;
        const schemaValue = schema[key];
        const configValue = config == null ? undefined : config[key];

        if (typeof schemaValue === 'string') {
            // Leaf: check presence and type
            if (configValue === undefined || configValue === null) {
                errors.push(`"${fullPath}" is required but missing`);
            } else {
                const actualType = Array.isArray(configValue) ? 'array' : typeof configValue;
                if (actualType !== schemaValue) {
                    errors.push(`"${fullPath}" should be ${schemaValue} but got ${actualType}`);
                }
            }
        } else if (schemaValue !== null && typeof schemaValue === 'object') {
            // Nested schema — recurse
            if (configValue === undefined || configValue === null) {
                errors.push(`"${fullPath}" is required but missing`);
            } else if (typeof configValue !== 'object' || Array.isArray(configValue)) {
                errors.push(`"${fullPath}" should be an object`);
            } else {
                const nested = validate(configValue, schemaValue, fullPath);
                errors.push(...nested.errors);
            }
        }
    }

    return { valid: errors.length === 0, errors };
}

module.exports = { validate };
