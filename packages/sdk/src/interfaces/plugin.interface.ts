import {
  SpacePluginPropsInterface,
  WidgetPluginPropsInterface,
  HomePluginPropsInterface
} from './pluginProps.interface';

export interface PluginInterface {
  SpaceApp?: React.FC<SpacePluginPropsInterface>;
  WidgetApp?: React.FC<WidgetPluginPropsInterface>;
  HomeApp?: React.FC<HomePluginPropsInterface>;
}
