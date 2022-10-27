export interface APIInterface {
  get: <Value>(key: string) => Promise<Value>;
  set: <Value>(key: string, value: Value) => Promise<void>;
}
