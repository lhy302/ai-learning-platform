export class AsyncCache {
  constructor() {
    this.cache = new Map();
    this.inflight = new Map();
  }
  async get(key, fetcher) {
    if (this.cache.has(key)) return this.cache.get(key);
    if (this.inflight.has(key)) return this.inflight.get(key);

    const promise = (async () => {
      try {
        const val = await fetcher();
        this.cache.set(key, val);
        return val;
      } finally {
        this.inflight.delete(key);
      }
    })();

    this.inflight.set(key, promise);
    return promise;
  }
}