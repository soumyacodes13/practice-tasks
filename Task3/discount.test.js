const applyDiscount = require('./discount');

describe('applyDiscount - Initial Tests', () => {
    test('should apply VIP discount (15%)', () => {
        expect(applyDiscount(100, 'vip', null)).toBe(85);
    });

    test('should apply Regular discount (5%)', () => {
        expect(applyDiscount(100, 'regular', null)).toBe(95);
    });

    test('should apply no discount for unknown customer type', () => {
        expect(applyDiscount(100, 'guest', null)).toBe(100);
    });
});

describe('applyDiscount - Improved Tests (Edge Cases & Coupons)', () => {
    test('should throw error for negative price', () => {
        expect(() => applyDiscount(-10, 'vip', null)).toThrow('Invalid price');
    });

    test('should return 0 for zero price', () => {
        expect(applyDiscount(0, 'vip', null)).toBe(0);
    });

    test('should apply SAVE20 coupon (20%)', () => {
        // SAVE20 (20%) is better than VIP (15%)
        expect(applyDiscount(100, 'vip', 'SAVE20')).toBe(80);
    });

    test('should apply SAVE10 coupon (10%)', () => {
        // Regular (5%) < SAVE10 (10%)
        expect(applyDiscount(100, 'regular', 'SAVE10')).toBe(90);
    });

    test('should prioritize VIP discount over SAVE10', () => {
        // VIP (15%) > SAVE10 (10%)
        expect(applyDiscount(100, 'vip', 'SAVE10')).toBe(85);
    });

    test('should handle rounding correctly for complex prices', () => {
        // 99.99 with 5% discount = 94.9905 -> 94.99
        expect(applyDiscount(99.99, 'regular', null)).toBe(94.99);
    });
});
