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
      haveAccess: types.maybe(types.boolean),

      permissionsRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    fetchPermissions: flow(function* () {
      const response = yield self.permissionsRequest.send(
        api.worldBuilderRepository.checkPermissions,
        {}
      );

      if (response) {
        self.haveAccess = response.permission;
        return;
      }

      self.haveAccess = false;
    })
  }));

export {RootWorldBuilderStore};
