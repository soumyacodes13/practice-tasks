function validate(data, schema) {
    const errors = [];

    for (const field in schema) {
        const rules = schema[field];
        const value = data[field];

        // 1. Check if required and missing
        if (rules.required && (value === undefined || value === null || value === '')) {
            errors.push(`${field} is required`);
            continue;
        }

        // 2. If optional and missing, skip further validation
        if (!rules.required && (value === undefined || value === null || value === '')) {
            continue;
        }

        // 3. Validate type
        if (rules.type) {
            switch (rules.type) {
                case 'string':
                    validateString(field, value, rules, errors);
                    break;
                case 'number':
                    validateNumber(field, value, rules, errors);
                    break;
                case 'email':
                    validateEmail(field, value, errors);
                    break;
                case 'url':
                    validateUrl(field, value, errors);
                    break;
                case 'date':
                    validateDate(field, value, errors);
                    break;
                default:
                    // Ignore unknown types for simplicity
                    break;
            }
        }
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

function validateString(field, value, rules, errors) {
    if (typeof value !== 'string') {
        errors.push(`${field} must be a string`);
        return;
    }

    if (rules.min !== undefined && value.length < rules.min) {
        errors.push(`${field} must contain at least ${rules.min} characters`);
    }

    if (rules.max !== undefined && value.length > rules.max) {
        errors.push(`${field} must contain at most ${rules.max} characters`);
    }
}

function validateNumber(field, value, rules, errors) {
    if (typeof value !== 'number') {
        errors.push(`${field} must be a number`);
        return;
    }

    if (rules.min !== undefined && value < rules.min) {
        errors.push(`${field} must be at least ${rules.min}`);
    }

    if (rules.max !== undefined && value > rules.max) {
        errors.push(`${field} must be at most ${rules.max}`);
    }
}

function validateEmail(field, value, errors) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        errors.push(`${field} is not a valid email`);
    }
}

function validateUrl(field, value, errors) {
    try {
        new URL(value);
    } catch (e) {
        errors.push(`${field} is not a valid URL`);
    }
}

function validateDate(field, value, errors) {
    if (typeof value !== 'string') {
        errors.push(`${field} must be a string`);
        return;
    }

    const isoRegex = /^(\d{4})-(\d{2})-(\d{2})(T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z)?$/;
    const match = value.match(isoRegex);

    if (!match) {
        errors.push(`${field} must be in ISO format (YYYY-MM-DD)`);
        return;
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) {
        errors.push(`${field} is not a valid date`);
        return;
    }

    // For YYYY-MM-DD, check if components match to detect invalid days like Feb 30
    const year = parseInt(match[1]);
    const month = parseInt(match[2]) - 1;
    const day = parseInt(match[3]);

    if (match[4]) {
        // If it has time, we'll trust Date.parse for validity since we checked regex
        return;
    }

    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month || date.getUTCDate() !== day) {
        errors.push(`${field} is not a valid date`);
    }
}

module.exports = { validate };
