interface IApiCache {
  [key: string]: {
    data: any;
    lastFetch: Date;
    sub: Set<(v: any) => void>;
  };
}

export class PubSubCache {
  private cache: IApiCache;

  constructor() {
    this.cache = {};
  }

  subscribe(key: string, fn: (event: any) => void) {
    this.cache[key].sub.add(fn);
  }

  unsubscribe(key: string, fn: (event: any) => void) {
    this.cache[key].sub.delete(fn);
  }

  emit(key: string, event: any) {
    this.cache[key].sub.forEach((fn) => fn(event));
  }
}
