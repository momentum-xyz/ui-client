import {PluginConfigInterface} from './pluginConfig.interface';
import {SpacePluginPropsInterface} from './pluginProps.interface';

export interface PluginInterface<C extends PluginConfigInterface = PluginConfigInterface> {
  SpaceExtension?: React.FC<SpacePluginPropsInterface<C>>;
}
