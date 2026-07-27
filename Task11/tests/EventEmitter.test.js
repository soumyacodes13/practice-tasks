import test from 'node:test';
import assert from 'node:assert';
import { EventEmitter } from '../src/EventEmitter.js';

test('EventEmitter - Core On and Emit', async () => {
    const emitter = new EventEmitter();
    let counter = 0;
    
    emitter.on('test.event', (data) => {
        counter += data.value;
    });

    await emitter.emit('test.event', { value: 5 });
    await emitter.emit('test.event', { value: 10 });

    assert.strictEqual(counter, 15, 'Handler should execute for each emission with correct data');
});

test('EventEmitter - Once Listener', async () => {
    const emitter = new EventEmitter();
    let calls = 0;

    emitter.once('click', () => {
        calls++;
    });

    await emitter.emit('click');
    await emitter.emit('click');
    await emitter.emit('click');

    assert.strictEqual(calls, 1, 'Once listener should only execute a single time');
});

test('EventEmitter - Off (Unsubscribe)', async () => {
    const emitter = new EventEmitter();
    let calls = 0;

    const handler = () => {
        calls++;
    };

    emitter.on('ping', handler);
    await emitter.emit('ping');
    
    emitter.off('ping', handler);
    await emitter.emit('ping');

    assert.strictEqual(calls, 1, 'Handler should not fire after being removed with off');
});

test('EventEmitter - Wildcard Matching', async () => {
    const emitter = new EventEmitter();
    const triggeredEvents = [];

    // Catch-all wildcard listener
    emitter.on('user.*', (data) => {
        triggeredEvents.push(data.action);
    });

    await emitter.emit('user.created', { action: 'created' });
    await emitter.emit('user.updated', { action: 'updated' });
    await emitter.emit('system.error', { action: 'error' }); // Should not trigger

    assert.deepStrictEqual(triggeredEvents, ['created', 'updated'], 'Wildcard should catch matching sub-events');
});

test('EventEmitter - Async Handlers & Concurrent Execution', async () => {
    const emitter = new EventEmitter();
    const executionOrder = [];

    emitter.on('async.task', async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
        executionOrder.push('slow');
    });

    emitter.on('async.task', async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        executionOrder.push('fast');
    });

    const results = await emitter.emit('async.task');

    assert.strictEqual(results.length, 2, 'Should return results for all handlers');
    assert.strictEqual(results[0].status, 'fulfilled');
    assert.strictEqual(results[1].status, 'fulfilled');
    // Fast should finish before slow due to concurrent execution order
    assert.deepStrictEqual(executionOrder, ['fast', 'slow']);
});

test('EventEmitter - Error Isolation', async () => {
    const emitter = new EventEmitter();
    let healthyHandlerCalled = false;

    emitter.on('faulty.event', () => {
        throw new Error('Handler crashed');
    });

    emitter.on('faulty.event', () => {
        healthyHandlerCalled = true;
    });

    const results = await emitter.emit('faulty.event');

    assert.strictEqual(results[0].status, 'rejected', 'First handler failure should be captured');
    assert.strictEqual(results[1].status, 'fulfilled', 'Second handler should still succeed');
    assert.strictEqual(healthyHandlerCalled, true, 'Error isolation must allow subsequent handlers to run');
});

test('EventEmitter - Emitting Wildcard Pattern', async () => {
    const emitter = new EventEmitter();
    const triggered = [];

    emitter.on('user.created', () => { triggered.push('created'); });
    emitter.on('user.updated', () => { triggered.push('updated'); });
    emitter.on('system.error', () => { triggered.push('error'); });

    await emitter.emit('user.*');

    assert.ok(triggered.includes('created'));
    assert.ok(triggered.includes('updated'));
    assert.ok(!triggered.includes('error'));
});