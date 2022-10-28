export interface APIInterface {
  get: <T>(key: string) => Promise<T>;
  set: <T>(key: string, value: T extends undefined ? never : T) => Promise<void>;
}
