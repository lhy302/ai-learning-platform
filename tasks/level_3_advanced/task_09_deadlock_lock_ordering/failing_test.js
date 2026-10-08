import { transferFunds } from './source.js';
import assert from 'node:assert';

class FakeMutex {
  constructor() { this.locked = false; this.waiters = []; }
  async lock() {
    if (!this.locked) { this.locked = true; return; }
    await new Promise(r => this.waiters.push(r));
    this.locked = true;
  }
  unlock() {
    this.locked = false;
    if (this.waiters.length > 0) this.waiters.shift()();
  }
}

const acc1 = { id: 'acc_1', balance: 100, mutex: new FakeMutex() };
const acc2 = { id: 'acc_2', balance: 100, mutex: new FakeMutex() };

// 并发双向互转
const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Deadlock detected!")), 300));
const transferPromise = Promise.all([
  transferFunds(acc1, acc2, 10),
  transferFunds(acc2, acc1, 10)
]);

try {
  await Promise.race([transferPromise, timeoutPromise]);
} catch (err) {
  assert.fail("并发双向转账由于加锁顺序不一致发生了死锁: " + err.message);
}