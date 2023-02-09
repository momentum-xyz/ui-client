export interface PluginConfigInterface extends Record<string, unknown> {}

export interface PluginConfigDescriptionItemInterface {
  displayName?: string;
  description?: string;
  type: 'string' | 'number' | 'boolean';
  required: boolean;
  defaultValue?: string | number | boolean;
}

export interface PluginConfigDescriptionInterface {
  [key: string]: PluginConfigDescriptionItemInterface;
}
