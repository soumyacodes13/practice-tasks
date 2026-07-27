const PasswordChecker = require('./checker');

describe('PasswordChecker', () => {
    test('should rate empty password as Weak with score 0', () => {
        const result = PasswordChecker.checkStrength('');
        expect(result.score).toBe(0);
        expect(result.rating).toBe('Weak');
    });

    test('should rate "password" as Weak (common, short, no variety)', () => {
        const result = PasswordChecker.checkStrength('password');
        expect(result.score).toBe(2); // length 8 (+1), lowercase (+1), common (+0). Total = 2.
        expect(result.rating).toBe('Weak');
    });

    test('should give +1 for length >= 8', () => {
        const result = PasswordChecker.checkStrength('abcde123'); // length 8 (+1), lower (+1), num (+1), not common (+1). Total = 4.
        expect(result.score).toBe(4);
    });

    test('should give +2 for length >= 12', () => {
        const result = PasswordChecker.checkStrength('abcde1234567'); // length 12 (+2), lower (+1), num (+1), not common (+1). Total = 5.
        expect(result.score).toBe(5);
    });

    test('should give +1 for uppercase', () => {
        const result = PasswordChecker.checkStrength('Abcde123'); // len 8 (+1), upper (+1), lower (+1), num (+1), not common (+1). Total = 5.
        expect(result.score).toBe(5);
    });

    test('should give +1 for special characters', () => {
        const result = PasswordChecker.checkStrength('abcde12!'); // len 8 (+1), lower (+1), num (+1), special (+1), not common (+1). Total = 5.
        expect(result.score).toBe(5);
    });

    test('should reach Strong with score 7', () => {
        const result = PasswordChecker.checkStrength('VeryLongP@ssw0rd');
        // len >= 12 (+2), upper (+1), lower (+1), num (+1), special (+1), not common (+1). Total = 7.
        expect(result.score).toBe(7);
        expect(result.rating).toBe('Strong');
    });

    test('should detect common passwords regardless of case', () => {
        const result = PasswordChecker.checkStrength('PASSWORD123'); // len 11 (+1), upper (+1), num (+1), common (+0). Total = 3.
        expect(result.score).toBe(3);
        expect(result.feedback).toContain('Avoid common passwords');
    });

    test('should handle very short passwords', () => {
        const result = PasswordChecker.checkStrength('123'); // len < 8 (+0), num (+1), not common (+1). Total = 2.
        expect(result.score).toBe(2);
        expect(result.rating).toBe('Weak');
    });

    test('should provide feedback for missing uppercase', () => {
        const result = PasswordChecker.checkStrength('password123!');
        expect(result.feedback).toContain('Add uppercase letters');
    });

    test('should provide feedback for missing numbers', () => {
        const result = PasswordChecker.checkStrength('Password!');
        expect(result.feedback).toContain('Add numbers');
    });

    test('should provide feedback for missing special characters', () => {
        const result = PasswordChecker.checkStrength('Password123');
        expect(result.feedback).toContain('Add special characters');
    });

    test('should rate score 3 as Fair', () => {
        expect(PasswordChecker.getRating(3)).toBe('Fair');
    });

    test('should rate score 5 as Good', () => {
        expect(PasswordChecker.getRating(5)).toBe('Good');
    });

    test('should rate score 6 as Good', () => {
        expect(PasswordChecker.getRating(6)).toBe('Good');
    });

    test('should rate score 2 as Weak', () => {
        expect(PasswordChecker.getRating(2)).toBe('Weak');
    });
});
