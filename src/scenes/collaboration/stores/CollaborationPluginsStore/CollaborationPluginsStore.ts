import {types, cast} from 'mobx-state-tree';

import {ResetModel} from 'core/models';
import {appVariables} from 'api/constants';
import {PluginInterface} from 'core/interfaces';

import {CollaborationPlugin} from './models/CollaborationPlugin/CollaborationPlugin';

const COLLABORATION_PLUGIN_LIST: PluginInterface[] = [
  {
    name: 'miro_plugin',
    subPath: 'miro',
    subtitle: 'Miro document',
    iconName: 'miro',
    // TODO: Later change to remote url
    url: appVariables.IS_DEV_ENVIRONMENT
      ? 'http://localhost:3001/remoteEntry.js'
      : ' https://dev.odyssey.ninja/plugins/miro/remoteEntry.js',
    exact: true
  }
];

const CollaboarationPluginStore = types
  .compose(
    ResetModel,
    types.model('CollaboarationPluginStore', {
      plugins: types.array(CollaborationPlugin)
    })
  )
  .actions((self) => ({
    init() {
      // TODO: Later change it to API call that returns this list
      self.plugins = cast(COLLABORATION_PLUGIN_LIST);
    }
  }));

export {CollaboarationPluginStore};
