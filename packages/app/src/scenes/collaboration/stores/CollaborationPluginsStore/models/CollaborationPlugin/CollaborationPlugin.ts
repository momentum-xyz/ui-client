import {Instance, types} from 'mobx-state-tree';
import {IconNameType} from '@momentum/ui-kit';

const CollaborationPlugin = types.model('CollaborationPlugin', {
  name: types.string,
  subPath: types.string,
  subtitle: types.maybe(types.string),
  url: types.string,
  exact: types.maybe(types.boolean),
  module: types.maybe(types.string),
  iconName: types.frozen<IconNameType>()
});

export interface CollaborationPluginInterface extends Instance<typeof CollaborationPlugin> {}

export {CollaborationPlugin};
