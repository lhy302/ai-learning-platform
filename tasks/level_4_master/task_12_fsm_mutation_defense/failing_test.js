import { OrderFSM } from './source.js';
import assert from 'node:assert';

const fsm = new OrderFSM();
let threw = false;

try {
  // 未付款直接申请退款，应当被系统严格拒绝
  fsm.transition('REFUND');
} catch (err) {
  threw = true;
}

assert.strictEqual(threw, true, "在 PENDING 初始状态下直接请求 REFUND 退款必须被状态机拦截抛错！");