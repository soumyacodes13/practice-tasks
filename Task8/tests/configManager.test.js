'use strict';

/**
 * Test suite for the JSON Configuration Manager.
 *
 * Run with:  npm test
 *
 * Strategy:
 *  - Tests that need a real file use os.tmpdir() to write a temp file.
 *  - Tests for get/set work directly on the in-memory _data object.
 */

const fs   = require('fs');
const os   = require('os');
const path = require('path');
const ConfigManager = require('../config/configManager');

// ── helpers ────────────────────────────────────────────────────────────────

/** Write a temp JSON file and return its path. */
function writeTmp(content) {
    const p = path.join(os.tmpdir(), `cfg_test_${Date.now()}_${Math.random()}.json`);
    fs.writeFileSync(p, content, 'utf8');
    return p;
}

// ── Loading ────────────────────────────────────────────────────────────────

describe('load()', () => {
    test('parses valid JSON and stores data', () => {
        const f   = writeTmp(JSON.stringify({ a: 1 }));
        const cfg = new ConfigManager();
        cfg.load(f);
        expect(cfg.get('a')).toBe(1);
    });

    test('throws on missing file', () => {
        const cfg = new ConfigManager();
        expect(() => cfg.load('/no/such/file.json')).toThrow(/cannot read file/);
    });

    test('throws on invalid JSON', () => {
        const f   = writeTmp('{ bad json }');
        const cfg = new ConfigManager();
        expect(() => cfg.load(f)).toThrow(/invalid JSON/);
    });

    test('load() returns the instance for chaining', () => {
        const f   = writeTmp('{}');
        const cfg = new ConfigManager();
        expect(cfg.load(f)).toBe(cfg);
    });
});

// ── get() ──────────────────────────────────────────────────────────────────

describe('get()', () => {
    let cfg;
    beforeEach(() => {
        cfg = new ConfigManager();
        cfg._data = {
            database: {
                host: 'localhost',
                port: 5432,
                nested: { deep: { value: 42 } }
            },
            flag: false
        };
    });

    test('returns a top-level value', () => {
        expect(cfg.get('flag')).toBe(false);
    });

    test('returns a nested value via dot notation', () => {
        expect(cfg.get('database.host')).toBe('localhost');
    });

    test('returns a deeply nested value', () => {
        expect(cfg.get('database.nested.deep.value')).toBe(42);
    });

    test('returns undefined for a missing key (no default)', () => {
        expect(cfg.get('database.missing')).toBeUndefined();
    });

    test('returns the supplied default for a missing key', () => {
        expect(cfg.get('database.port2', 9999)).toBe(9999);
    });

    test('returns the actual value even if a default is supplied', () => {
        expect(cfg.get('database.port', 9999)).toBe(5432);
    });

    test('returns undefined when traversal hits a non-object mid-path', () => {
        expect(cfg.get('database.host.sub')).toBeUndefined();
    });
});

// ── set() ──────────────────────────────────────────────────────────────────

describe('set()', () => {
    let cfg;
    beforeEach(() => {
        cfg = new ConfigManager();
        cfg._data = { database: { host: 'old' } };
    });

    test('updates an existing value', () => {
        cfg.set('database.host', 'new');
        expect(cfg.get('database.host')).toBe('new');
    });

    test('creates a new nested key', () => {
        cfg.set('database.port', 3306);
        expect(cfg.get('database.port')).toBe(3306);
    });

    test('creates intermediate objects when the path does not exist', () => {
        cfg.set('cache.redis.host', '127.0.0.1');
        expect(cfg.get('cache.redis.host')).toBe('127.0.0.1');
    });

    test('overwrites a scalar with an object', () => {
        cfg.set('database.host', { primary: 'a', replica: 'b' });
        expect(cfg.get('database.host.primary')).toBe('a');
    });

    test('set() returns the instance for chaining', () => {
        expect(cfg.set('x', 1)).toBe(cfg);
    });
});

// ── Environment variable interpolation ────────────────────────────────────────

describe('interpolation', () => {
    beforeEach(() => {
        process.env.DB_HOST = 'pg.example.com';
        process.env.DB_PORT = '5432';
        process.env.NODE_ENV = 'production';
    });

    afterEach(() => {
        delete process.env.DB_HOST;
        delete process.env.DB_PORT;
        delete process.env.NODE_ENV;
    });

    test('replaces a single placeholder', () => {
        const f   = writeTmp(JSON.stringify({ host: '${DB_HOST}' }));
        const cfg = new ConfigManager();
        cfg.load(f);
        expect(cfg.get('host')).toBe('pg.example.com');
    });

    test('replaces multiple placeholders in one string', () => {
        const f   = writeTmp(JSON.stringify({ dsn: '${DB_HOST}:${DB_PORT}' }));
        const cfg = new ConfigManager();
        cfg.load(f);
        expect(cfg.get('dsn')).toBe('pg.example.com:5432');
    });

    test('replaces placeholder embedded in a longer string', () => {
        const f   = writeTmp(JSON.stringify({ name: 'myapp_${NODE_ENV}' }));
        const cfg = new ConfigManager();
        cfg.load(f);
        expect(cfg.get('name')).toBe('myapp_production');
    });

    test('leaves unresolved placeholders intact when env var is absent', () => {
        const f   = writeTmp(JSON.stringify({ key: '${UNDEFINED_VAR}' }));
        const cfg = new ConfigManager();
        cfg.load(f);
        expect(cfg.get('key')).toBe('${UNDEFINED_VAR}');
    });

    test('does not alter plain strings with no placeholders', () => {
        const f   = writeTmp(JSON.stringify({ key: 'plain-value' }));
        const cfg = new ConfigManager();
        cfg.load(f);
        expect(cfg.get('key')).toBe('plain-value');
    });

    test('interpolates values inside nested objects', () => {
        const f   = writeTmp(JSON.stringify({ db: { host: '${DB_HOST}' } }));
        const cfg = new ConfigManager();
        cfg.load(f);
        expect(cfg.get('db.host')).toBe('pg.example.com');
    });

    test('interpolates values inside arrays', () => {
        const f   = writeTmp(JSON.stringify({ hosts: ['${DB_HOST}', 'static'] }));
        const cfg = new ConfigManager();
        cfg.load(f);
        expect(cfg.get('hosts')[0]).toBe('pg.example.com');
        expect(cfg.get('hosts')[1]).toBe('static');
    });
});

// ── validate() ────────────────────────────────────────────────────────────────

describe('validate()', () => {
    let cfg;
    beforeEach(() => {
        cfg = new ConfigManager();
        cfg._data = {
            database: {
                host: 'localhost',
                port: 5432,
                name: 'myapp'
            },
            debug: false
        };
    });

    const schema = {
        database: {
            host: 'string',
            port: 'number',
            name: 'string'
        },
        debug: 'boolean'
    };

    test('returns valid:true for a correct config', () => {
        const result = cfg.validate(schema);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    test('detects a missing top-level field', () => {
        delete cfg._data.debug;
        const result = cfg.validate(schema);
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.includes('"debug"'))).toBe(true);
    });

    test('detects a missing nested field', () => {
        delete cfg._data.database.port;
        const result = cfg.validate(schema);
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.includes('"database.port"'))).toBe(true);
    });

    test('detects a wrong type on a nested field', () => {
        cfg._data.database.port = '5432'; // string instead of number
        const result = cfg.validate(schema);
        expect(result.valid).toBe(false);
        expect(result.errors[0]).toMatch(/database\.port.*number/);
    });

    test('detects multiple errors at once', () => {
        delete cfg._data.database.host;
        cfg._data.database.port = 'bad';
        const result = cfg.validate(schema);
        expect(result.errors.length).toBeGreaterThanOrEqual(2);
    });

    test('reports an error when a nested object is entirely missing', () => {
        delete cfg._data.database;
        const result = cfg.validate(schema);
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.includes('"database"'))).toBe(true);
    });

    test('returns valid:true for an empty schema', () => {
        const result = cfg.validate({});
        expect(result.valid).toBe(true);
    });

    test('detects wrong type on a top-level field', () => {
        cfg._data.debug = 'yes'; // should be boolean
        const result = cfg.validate(schema);
        expect(result.valid).toBe(false);
        expect(result.errors[0]).toMatch(/debug.*boolean/);
    });

    test('validates against a schema on an empty config', () => {
        cfg._data = {};
        const result = cfg.validate(schema);
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
    });
});
