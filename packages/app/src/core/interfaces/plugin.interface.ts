export interface PluginInterface {
  name: string;
  subPath: string;
  subtitle?: string;
  url: string;
  exact?: boolean;
  iconName: IconNameType;
}
