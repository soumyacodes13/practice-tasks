const commonPasswords = require('./common_passwords.json').common;

class PasswordChecker {
    static checkStrength(password) {
        let score = 0;
        const feedback = [];

        if (!password) {
            return {
                score: 0,
                rating: 'Weak',
                feedback: ['Password cannot be empty']
            };
        }

        // 1. Length
        if (password.length >= 12) {
            score += 2;
        } else if (password.length >= 8) {
            score += 1;
        } else {
            feedback.push('Password is too short (min 8 characters)');
        }

        // 2. Character variety
        if (/[A-Z]/.test(password)) {
            score += 1;
        } else {
            feedback.push('Add uppercase letters');
        }

        if (/[a-z]/.test(password)) {
            score += 1;
        } else {
            feedback.push('Add lowercase letters');
        }

        if (/[0-9]/.test(password)) {
            score += 1;
        } else {
            feedback.push('Add numbers');
        }

        if (/[^A-Za-z0-9]/.test(password)) {
            score += 1;
        } else {
            feedback.push('Add special characters');
        }

        // 3. Not common
        if (!commonPasswords.includes(password.toLowerCase())) {
            score += 1;
        } else {
            feedback.push('Avoid common passwords');
        }

        return {
            score,
            rating: this.getRating(score),
            feedback
        };
    }

    static getRating(score) {
        if (score <= 2) return 'Weak';
        if (score <= 4) return 'Fair';
        if (score <= 6) return 'Good';
        return 'Strong';
    }
}

module.exports = PasswordChecker;
