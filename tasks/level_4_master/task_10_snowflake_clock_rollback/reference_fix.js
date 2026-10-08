export class SnowflakeIdGenerator {
  constructor(workerId = 1) {
    this.workerId = workerId;
    this.sequence = 0;
    this.lastTimestamp = -1;
  }
  nextId() {
    let now = Date.now();
    if (now < this.lastTimestamp) {
      const offset = this.lastTimestamp - now;
      throw new Error("Clock rollback detected: server clock moved backwards by " + offset + "ms");
    }
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