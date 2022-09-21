import {ThemeInterface} from 'ui-kit';

export interface PluginConfigInterface {
  theme: ThemeInterface;
  onClose?: () => void;
}
