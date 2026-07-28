'use strict';

const Cache = require('./cache');

const cache = new Cache();

// Store different data types
cache.set('name', 'John Doe', 10);
cache.set('age', 25, 10);
cache.set('isAdmin', true, 10);
cache.set('user', {
    id: 1,
    email: 'john@example.com'
}, 10);

console.log('=== Initial Values ===');
console.log(cache.get('name'));
console.log(cache.get('age'));
console.log(cache.get('isAdmin'));
console.log(cache.get('user'));

console.log('\n=== Existence Check ===');
console.log(cache.has('name'));
console.log(cache.has('unknown'));

console.log('\n=== Statistics ===');
console.log(cache.stats());

// Wait long enough for TTL to expire
setTimeout(() => {
    console.log('\n=== After TTL Expiration ===');
    console.log(cache.get('name'));
    console.log(cache.has('name'));

    console.log('\n=== Updated Statistics ===');
    console.log(cache.stats());

    cache.destroy();
}, 11000);
