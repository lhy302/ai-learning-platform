export class AsyncCache {
  constructor() {
    this.cache = new Map();
  }
  async get(key, fetcher) {
    if (this.cache.has(key)) return this.cache.get(key);
    // BUG: 并发请求未合并，同时到达的请求都会执行 fetcher()
    const val = await fetcher();
    this.cache.set(key, val);
    return val;
  }
}