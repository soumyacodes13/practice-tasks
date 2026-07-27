'use strict';

/**
 * demo.js — Demonstrates all ConfigManager features.
 * Run with:  npm start
 */

const path          = require('path');
const ConfigManager = require('./config/configManager');

// ── Setup: set env vars that config.json references ───────────────────────────
process.env.DB_HOST   = process.env.DB_HOST   || 'localhost';
process.env.DB_PORT   = process.env.DB_PORT   || '5432';
process.env.NODE_ENV  = process.env.NODE_ENV  || 'development';
process.env.LOG_LEVEL = process.env.LOG_LEVEL || 'info';

const cfg = new ConfigManager();

// ── 1. Load ───────────────────────────────────────────────────────────────────
cfg.load(path.join(__dirname, 'src', 'config.json'));
console.log('\n── 1. Loaded config ─────────────────────────────────────────');
console.log(JSON.stringify(cfg._data, null, 2));

// ── 2. get() ──────────────────────────────────────────────────────────────────
console.log('\n── 2. get() ─────────────────────────────────────────────────');
console.log('database.host  →', cfg.get('database.host'));
console.log('database.port  →', cfg.get('database.port'));
console.log('database.name  →', cfg.get('database.name'));
console.log('missing.key    →', cfg.get('missing.key'));               // undefined
console.log('missing + def  →', cfg.get('missing.key', 'fallback'));   // fallback

// ── 3. set() ──────────────────────────────────────────────────────────────────
console.log('\n── 3. set() ─────────────────────────────────────────────────');
cfg.set('database.port', 3306);
console.log('database.port after set →', cfg.get('database.port'));

cfg.set('cache.redis.host', '127.0.0.1');
console.log('cache.redis.host (new)  →', cfg.get('cache.redis.host'));

// ── 4. validate() ─────────────────────────────────────────────────────────────
const schema = require('./src/schema.json');

console.log('\n── 4. validate() — valid config ─────────────────────────────');
// Provide numeric port so validation passes after set() above
cfg.set('database.port', 5432);
let result = cfg.validate(schema);
console.log('valid:', result.valid, '| errors:', result.errors);

console.log('\n── 5. validate() — invalid config ───────────────────────────');
cfg.set('database.port', 'not-a-number'); // intentional bad value
result = cfg.validate(schema);
console.log('valid:', result.valid);
console.log('errors:', result.errors);
