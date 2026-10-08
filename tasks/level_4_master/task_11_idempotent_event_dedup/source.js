export class IdempotentEventConsumer {
  constructor() {
    this.processedSet = new Set();
    this.totalBalance = 0;
  }
  async processEvent(event) {
    // BUG: 典型的 Check-then-act 竞态！在异步处理完成前，并发事件也会通过此检查！
    if (this.processedSet.has(event.eventId)) {
      return false;
    }
    // 模拟异步外部写入
    await new Promise(r => setTimeout(r, 20));
    this.totalBalance += event.amount;
    this.processedSet.add(event.eventId);
    return true;
  }
}