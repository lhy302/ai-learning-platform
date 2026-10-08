export class IdempotentEventConsumer {
  constructor() {
    this.processedSet = new Set();
    this.inflight = new Set();
    this.totalBalance = 0;
  }
  async processEvent(event) {
    // 立即原子占位，杜绝 Check-then-act 竞态
    if (this.processedSet.has(event.eventId) || this.inflight.has(event.eventId)) {
      return false;
    }
    this.inflight.add(event.eventId);

    try {
      await new Promise(r => setTimeout(r, 20));
      this.totalBalance += event.amount;
      this.processedSet.add(event.eventId);
      return true;
    } finally {
      this.inflight.delete(event.eventId);
    }
  }
}