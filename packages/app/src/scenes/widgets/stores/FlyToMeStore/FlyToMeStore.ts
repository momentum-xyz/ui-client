import {flow, types} from 'mobx-state-tree';
import {Dialog, RequestModel, ResetModel} from '@momentum-xyz/core';

import {api} from 'api';

const FlyToMeStore = types.compose(
  ResetModel,
  types
    .model('FlyToMeStore', {
      flyToMeDialog: types.optional(Dialog, {}),
      request: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      flyToMe: flow(function* (spaceId: string) {
        yield self.request.send(api.flightRepository.flyToMe, {spaceId});
      })
    }))
);

export {FlyToMeStore};
