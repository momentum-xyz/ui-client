import {flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {api} from 'api';

// TODO: FlyTo. Movement after getting design
const FlyToMeStore = types.compose(
  ResetModel,
  types
    .model('FlyToMeStore', {
      request: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      flyToMe: flow(function* (spaceId: string) {
        yield self.request.send(api.flightRepository.flyToMe, {spaceId});
      })
    }))
);

export {FlyToMeStore};
