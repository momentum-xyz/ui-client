import {flow, types, Instance} from 'mobx-state-tree';
import {RequestModel} from '@momentum/core';
import {ResetModel} from '@momentum/sdk';

import {api, CreateInitiativeResponse, NewSpaceDetailsInterface} from 'api';
import {DialogModel} from 'core/models';

const LaunchInitiativeStore = types
  .compose(
    ResetModel,
    types.model('LaunchInitiativeStore', {
      dialog: types.optional(DialogModel, {}),
      request: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    create: flow(function* (space: NewSpaceDetailsInterface) {
      const response: CreateInitiativeResponse = yield self.request.send(
        api.spaceRepository.createInitiative,
        {
          initiative: space
        }
      );

      return {
        isSuccess: self.request.isDone && response,
        spaceId: response ? response.id : undefined
      };
    })
  }));

export type LaunchInitiativeStoreType = Instance<typeof LaunchInitiativeStore>;

export {LaunchInitiativeStore};
