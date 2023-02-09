export interface PluginApiInterface<C = unknown> {
  getStateItem: <T>(key: string) => Promise<T>;
  setStateItem: <T>(key: string, value: T) => Promise<T>;
  deleteStateItem: (key: string) => Promise<null>;
  getConfig: () => Promise<C>;

  useStateItemChange: <T = unknown>(key: string, callback: (value: T) => void) => void;
  useStateItemRemove: (key: string, callback: () => void) => void;
}
