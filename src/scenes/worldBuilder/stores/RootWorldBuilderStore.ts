import {flow, types} from 'mobx-state-tree';

import {RequestModel, ResetModel} from 'core/models';
import {api} from 'api';

import {WorldBuilderNameStore} from './WorldBuilderNameStore';
import {WorldBuilderTemplatesStore} from './WorldBuilderTemplatesStore';

const RootWorldBuilderStore = types
  .compose(
    ResetModel,
    types.model('RootWorldBuilderStore', {
      worldBuilderNameStore: types.optional(WorldBuilderNameStore, {}),
      worldBuilderTemplatesStore: types.optional(WorldBuilderTemplatesStore, {}),

      permissionsRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    haveAccessPermissions: flow(function* () {
      const response = yield self.permissionsRequest.send(
        api.worldBuilderRepository.checkPermissions,
        {}
      );

      if (response) {
        return response.permission;
      }

      return false;
    })
  }));

export {RootWorldBuilderStore};
