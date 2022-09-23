import {types, cast} from 'mobx-state-tree';

import {ResetModel} from 'core/models';
import {COLLABORATION_PLUGIN_LIST} from 'core/constants/pluginList.constant';
import {ThemeInterface} from 'ui-kit';

import {CollaborationPlugin} from './models/CollaborationPlugin/CollaborationPlugin';

const CollaboarationPluginStore = types
  .compose(
    ResetModel,
    types.model('CollaboarationPluginStore', {
      plugins: types.array(CollaborationPlugin)
    })
  )
  .actions((self) => ({
    init(theme: ThemeInterface, isSpaceAdmin: boolean, spaceId: string) {
      // TODO: Later change it to API call that returns this list
      self.plugins = cast(
        COLLABORATION_PLUGIN_LIST({
          theme,
          isSpaceAdmin,
          spaceId
        })
      );
    }
  }));

export {CollaboarationPluginStore};
