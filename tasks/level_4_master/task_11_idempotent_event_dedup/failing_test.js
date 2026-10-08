import { IdempotentEventConsumer } from './source.js';
import assert from 'node:assert';

const consumer = new IdempotentEventConsumer();
const event = { eventId: 'evt_1001', amount: 50 };

// 并发投递两次完全相同的事件
const [res1, res2] = await Promise.all([
  consumer.processEvent(event),
  consumer.processEvent(event)
]);

assert.strictEqual(consumer.totalBalance, 50, "相同事件并发投递只能结算一次，实际余额变成了: " + consumer.totalBalance);