'use strict';

const Cache = require('./cache');

describe('Cache', () => {
    let cache;

    beforeEach(() => {
        jest.useFakeTimers();
        cache = new Cache();
    });

    afterEach(() => {
        cache.destroy();
        jest.useRealTimers();
    });

    test('should store and retrieve a value', () => {
        cache.set('name', 'John', 10);

        expect(cache.get('name')).toBe('John');
    });

    test('should return undefined for missing keys', () => {
        expect(cache.get('unknown')).toBeUndefined();
    });

    test('should delete a key', () => {
        cache.set('name', 'John', 10);

        cache.del('name');

        expect(cache.get('name')).toBeUndefined();
    });

    test('should clear all entries', () => {
        cache.set('a', 1, 10);
        cache.set('b', 2, 10);

        cache.clear();

        expect(cache.has('a')).toBe(false);
        expect(cache.has('b')).toBe(false);
    });

    test('should check key existence', () => {
        cache.set('user', 'Alice', 10);

        expect(cache.has('user')).toBe(true);
        expect(cache.has('missing')).toBe(false);
    });

    test('should expire entries after TTL', () => {
        cache.set('temp', 'value', 5);

        jest.advanceTimersByTime(6000);

        expect(cache.get('temp')).toBeUndefined();
    });

    test('should update TTL', () => {
        cache.set('token', 'abc', 5);

        jest.advanceTimersByTime(3000);

        cache.ttl('token', 5);

        jest.advanceTimersByTime(3000);

        expect(cache.get('token')).toBe('abc');
    });

    test('should support different data types', () => {
        cache.set('number', 42, 10);
        cache.set('boolean', true, 10);
        cache.set('array', [1, 2, 3], 10);
        cache.set('object', { name: 'John' }, 10);

        expect(cache.get('number')).toBe(42);
        expect(cache.get('boolean')).toBe(true);
        expect(cache.get('array')).toEqual([1, 2, 3]);
        expect(cache.get('object')).toEqual({ name: 'John' });
    });

    test('should track statistics', () => {
        cache.set('user', 'John', 10);

        cache.get('user');      // hit
        cache.get('missing');   // miss

        const stats = cache.stats();

        expect(stats.entries).toBe(1);
        expect(stats.hits).toBe(1);
        expect(stats.misses).toBe(1);
        expect(stats.hitRate).toBe(50);
    });
});