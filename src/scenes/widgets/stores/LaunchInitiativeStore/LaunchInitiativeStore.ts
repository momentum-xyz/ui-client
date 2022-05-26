import {flow, types, Instance} from 'mobx-state-tree';

import {api, CreateInitiativeResponse, NewSpaceDetails} from 'api';
import {DialogModel, RequestModel, ResetModel} from 'core/models';

const LaunchInitiativeStore = types
  .compose(
    ResetModel,
    types.model('LaunchInitiativeStore', {
      dialog: types.optional(DialogModel, {}),
      request: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    create: flow(function* (space: NewSpaceDetails) {
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

export interface LaunchInitiativeStoreInterface extends Instance<typeof LaunchInitiativeStore> {}

export {LaunchInitiativeStore};
