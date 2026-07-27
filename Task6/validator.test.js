const { validate } = require('./validator');

describe('Data Validator', () => {

    describe('Required Validation', () => {
        test('should return error for missing required field', () => {
            const schema = { name: { type: 'string', required: true } };
            const result = validate({}, schema);
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('name is required');
        });

        test('should pass for missing optional field', () => {
            const schema = { website: { type: 'url', required: false } };
            const result = validate({}, schema);
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
    });

    describe('String Validation', () => {
        const schema = { name: { type: 'string', required: true, min: 2, max: 10 } };

        test('valid string', () => expect(validate({ name: 'John' }, schema).valid).toBe(true));
        test('too short', () => expect(validate({ name: 'J' }, schema).errors).toContain('name must contain at least 2 characters'));
        test('too long', () => expect(validate({ name: 'JohnJohnJohn' }, schema).errors).toContain('name must contain at most 10 characters'));
        test('exactly min', () => expect(validate({ name: 'Jo' }, schema).valid).toBe(true));
        test('exactly max', () => expect(validate({ name: '1234567890' }, schema).valid).toBe(true));
        test('wrong type (number)', () => expect(validate({ name: 123 }, schema).errors).toContain('name must be a string'));
        test('empty string but required', () => expect(validate({ name: '' }, schema).errors).toContain('name is required'));
        test('optional too short', () => {
            const s = { title: { type: 'string', min: 5 } };
            expect(validate({ title: 'abc' }, s).errors).toContain('title must contain at least 5 characters');
        });
        test('optional valid', () => {
            const s = { title: { type: 'string', min: 5 } };
            expect(validate({ title: 'abcde' }, s).valid).toBe(true);
        });
        test('optional missing', () => {
            const s = { title: { type: 'string', min: 5 } };
            expect(validate({}, s).valid).toBe(true);
        });
    });

    describe('Number Validation', () => {
        const schema = { age: { type: 'number', required: true, min: 18, max: 120 } };

        test('valid number', () => expect(validate({ age: 25 }, schema).valid).toBe(true));
        test('too small', () => expect(validate({ age: 17 }, schema).errors).toContain('age must be at least 18'));
        test('too large', () => expect(validate({ age: 121 }, schema).errors).toContain('age must be at most 120'));
        test('exactly min', () => expect(validate({ age: 18 }, schema).valid).toBe(true));
        test('exactly max', () => expect(validate({ age: 120 }, schema).valid).toBe(true));
        test('wrong type (string)', () => expect(validate({ age: '25' }, schema).errors).toContain('age must be a number'));
        test('negative valid', () => {
            const s = { temp: { type: 'number', min: -10 } };
            expect(validate({ temp: -5 }, s).valid).toBe(true);
        });
        test('decimal valid', () => expect(validate({ age: 25.5 }, schema).valid).toBe(true));
        test('zero value', () => {
            const s = { count: { type: 'number', min: 0 } };
            expect(validate({ count: 0 }, s).valid).toBe(true);
        });
        test('null value', () => expect(validate({ age: null }, schema).errors).toContain('age is required'));
    });

    describe('Email Validation', () => {
        const schema = { email: { type: 'email', required: true } };

        test('valid email', () => expect(validate({ email: 'abc@gmail.com' }, schema).valid).toBe(true));
        test('invalid email (missing @)', () => expect(validate({ email: 'abcgmail.com' }, schema).errors).toContain('email is not a valid email'));
        test('invalid email (missing .com)', () => expect(validate({ email: 'abc@gmail' }, schema).errors).toContain('email is not a valid email'));
        test('invalid email (spaces)', () => expect(validate({ email: 'abc @gmail.com' }, schema).errors).toContain('email is not a valid email'));
        test('valid with dots', () => expect(validate({ email: 'john.doe@sub.domain.co' }, schema).valid).toBe(true));
        test('missing required email', () => expect(validate({}, schema).errors).toContain('email is required'));
        test('optional email valid', () => expect(validate({ email: 'a@b.c' }, { email: { type: 'email' } }).valid).toBe(true));
        test('optional email missing', () => expect(validate({}, { email: { type: 'email' } }).valid).toBe(true));
        test('optional email invalid', () => expect(validate({ email: 'invalid' }, { email: { type: 'email' } }).errors).toContain('email is not a valid email'));
        test('empty email', () => expect(validate({ email: '' }, schema).errors).toContain('email is required'));
    });

    describe('URL Validation', () => {
        const schema = { website: { type: 'url', required: false } };

        test('valid https URL', () => expect(validate({ website: 'https://google.com' }, schema).valid).toBe(true));
        test('valid http URL', () => expect(validate({ website: 'http://localhost:3000' }, schema).valid).toBe(true));
        test('invalid URL (no protocol)', () => expect(validate({ website: 'google.com' }, schema).errors).toContain('website is not a valid URL'));
        test('invalid URL (random text)', () => expect(validate({ website: 'not-a-url' }, schema).errors).toContain('website is not a valid URL'));
        test('missing optional URL', () => expect(validate({}, schema).valid).toBe(true));
        test('required URL valid', () => expect(validate({ website: 'https://a.b' }, { website: { type: 'url', required: true } }).valid).toBe(true));
        test('required URL missing', () => expect(validate({}, { website: { type: 'url', required: true } }).errors).toContain('website is required'));
        test('URL with path', () => expect(validate({ website: 'https://site.com/path?q=1' }, schema).valid).toBe(true));
        test('URL with port', () => expect(validate({ website: 'https://site.com:8080' }, schema).valid).toBe(true));
        test('empty URL required', () => expect(validate({ website: '' }, { website: { type: 'url', required: true } }).errors).toContain('website is required'));
    });

    describe('Date Validation', () => {
        const schema = { dob: { type: 'date', required: true } };

        test('valid ISO date', () => expect(validate({ dob: '2026-07-27' }, schema).valid).toBe(true));
        test('valid ISO datetime', () => expect(validate({ dob: '2026-07-27T10:30:00Z' }, schema).valid).toBe(true));
        test('invalid date string', () => expect(validate({ dob: 'not-a-date' }, schema).errors).toContain('dob must be in ISO format (YYYY-MM-DD)'));
        test('wrong format (not YYYY-MM-DD)', () => expect(validate({ dob: '27-07-2026' }, schema).errors).toContain('dob must be in ISO format (YYYY-MM-DD)'));
        test('leap year valid', () => expect(validate({ dob: '2024-02-29' }, schema).valid).toBe(true));
        test('invalid day', () => expect(validate({ dob: '2026-02-30' }, schema).errors).toContain('dob is not a valid date'));
        test('missing required date', () => expect(validate({}, schema).errors).toContain('dob is required'));
        test('optional date missing', () => expect(validate({}, { dob: { type: 'date' } }).valid).toBe(true));
        test('optional date valid', () => expect(validate({ dob: '2026-01-01' }, { dob: { type: 'date' } }).valid).toBe(true));
        test('empty date required', () => expect(validate({ dob: '' }, schema).errors).toContain('dob is required'));
    });

    describe('Multi-field Validation', () => {
        test('should collect multiple errors', () => {
            const schema = {
                name: { type: 'string', required: true, min: 2 },
                age: { type: 'number', required: true, min: 18 },
                email: { type: 'email', required: true }
            };
            const data = {
                name: '',
                age: 5,
                email: 'invalid'
            };
            const result = validate(data, schema);
            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(3);
            expect(result.errors).toContain('name is required');
            expect(result.errors).toContain('age must be at least 18');
            expect(result.errors).toContain('email is not a valid email');
        });
    });
});
