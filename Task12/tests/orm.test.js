import test from 'node:test';
import assert from 'node:assert';
import { db } from '../src/Database.js';
import { model } from '../src/Model.js';

test('ORM - Model CRUD Operations', async () => {
    db.clear();

    const User = model('User', {
        id: { type: 'number', primary: true },
        name: { type: 'string', required: true },
        email: { type: 'string', unique: true }
    });

    // Create
    const user1 = await User.create({ name: 'John', email: 'john@example.com' });
    assert.strictEqual(user1.id, 1, 'First record should auto-increment primary key to 1');
    assert.strictEqual(user1.name, 'John');

    const user2 = await User.create({ name: 'Jane', email: 'jane@example.com' });
    assert.strictEqual(user2.id, 2, 'Second record should auto-increment primary key to 2');

    // Find all matching
    const matching = await User.find({ name: 'John' });
    assert.strictEqual(matching.length, 1);
    assert.strictEqual(matching[0].email, 'john@example.com');

    // Find by ID
    const found = await User.findById(1);
    assert.ok(found);
    assert.strictEqual(found.name, 'John');

    // Update
    const updated = await User.update(1, { name: 'Johnny' });
    assert.strictEqual(updated.name, 'Johnny');
    assert.strictEqual(updated.id, 1, 'ID should remain unchanged');

    // Delete
    const deleted = await User.delete(2);
    assert.strictEqual(deleted, true);

    const checkDeleted = await User.findById(2);
    assert.strictEqual(checkDeleted, null, 'Deleted record should no longer be found');
});

test('ORM - Validation Rules', async () => {
    db.clear();

    const Product = model('Product', {
        sku: { type: 'string', primary: true },
        price: { type: 'number', required: true },
        tag: { type: 'string', unique: true }
    });

    // Enforce required fields
    await assert.rejects(
        async () => {
            await Product.create({ sku: 'P1' });
        },
        /Field 'price' is required/,
        'Should reject when required field is missing'
    );

    // Enforce type safety
    await assert.rejects(
        async () => {
            await Product.create({ sku: 'P1', price: 'ten' });
        },
        /Field 'price' must be of type 'number'/,
        'Should reject type mismatch'
    );

    // Enforce unique constraints
    await Product.create({ sku: 'P1', price: 10, tag: 'sale' });
    await assert.rejects(
        async () => {
            await Product.create({ sku: 'P2', price: 15, tag: 'sale' });
        },
        /Field 'tag' must be unique/,
        'Should reject duplicate unique field values'
    );
});
