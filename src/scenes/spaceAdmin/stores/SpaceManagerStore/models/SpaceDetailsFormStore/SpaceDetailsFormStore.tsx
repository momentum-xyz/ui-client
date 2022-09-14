import {flow, types} from 'mobx-state-tree';

import {RequestModel, ResetModel} from 'core/models';
import {api} from 'api';
import {SpaceSettingsInterface} from 'api/repositories/spaceRepository/spaceRepository.api.types';

const SpaceDetailsFormStore = types.compose(
  ResetModel,
  types
    .model('SpaceDetailsFormStore', {
      editSpaceRequest: types.optional(RequestModel, {}),
      deleteSpaceRequest: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      saveDetails: flow(function* (settings: SpaceSettingsInterface, spaceId: string) {
        yield self.editSpaceRequest.send(api.spaceRepository.editSpace, {
          spaceId,
          settings
        });

        return self.editSpaceRequest.isDone;
      }),
      deleteSpace: flow(function* (spaceId: string) {
        yield self.deleteSpaceRequest.send(api.spaceRepository.deleteSpace, {spaceId});
      })
    }))
    .views((self) => ({
      get isPending(): boolean {
        return self.editSpaceRequest.isPending;
      }
    }))
);

export {SpaceDetailsFormStore};
