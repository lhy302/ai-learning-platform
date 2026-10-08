export class SnowflakeIdGenerator {
  constructor(workerId = 1) {
    this.workerId = workerId;
    this.sequence = 0;
    this.lastTimestamp = -1;
  }
  nextId() {
    let now = Date.now();
    // BUG: 未检测 now < this.lastTimestamp，时钟回拨时会重新生成历史区间的 ID！
    if (now === this.lastTimestamp) {
      this.sequence = (this.sequence + 1) & 4095;
      if (this.sequence === 0) {
        while (now <= this.lastTimestamp) now = Date.now();
      }
    } else {
      this.sequence = 0;
    }
    this.lastTimestamp = now;
    return `${now}-${this.workerId}-${this.sequence}`;
  }
}