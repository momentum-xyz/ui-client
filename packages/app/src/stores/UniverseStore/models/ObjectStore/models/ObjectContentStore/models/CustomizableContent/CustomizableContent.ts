import {flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {api, GetObjectResponse, ObjectInterface} from 'api';

const CustomizableContent = types
  .compose(
    ResetModel,
    types.model('CustomizableContent', {
      content: types.maybe(types.frozen<ObjectInterface>()),

      request: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    initContent: flow(function* (pluginId: string, spaceId: string) {
      const response: GetObjectResponse = yield self.request.send(
        api.objectRepository.fetchObject,
        {
          spaceId,
          pluginId
        }
      );

      if (response) {
        self.content = response;
      }
    })
  }))
  .actions(() => ({}))
  .views(() => ({}));

export {CustomizableContent};
