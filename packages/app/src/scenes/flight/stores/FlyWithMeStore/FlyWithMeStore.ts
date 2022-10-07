import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum/core';

import {api, ProfileResponse} from 'api';
import {UserProfileModel} from 'core/models';

const FlyWithMeStore = types
  .compose(
    ResetModel,
    types.model('FlyWithMeStore', {
      isActive: false,
      pilot: types.maybeNull(UserProfileModel),
      pilotRequest: types.optional(RequestModel, {}),
      startRequest: types.optional(RequestModel, {}),
      stopRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    init(pilotId: string): void {
      self.isActive = true;
      this.fetchPilot(pilotId);
    },
    fetchPilot: flow(function* (pilotId: string) {
      const response: ProfileResponse = yield self.pilotRequest.send(
        api.userRepository.fetchProfile,
        {userId: pilotId}
      );

      if (response) {
        self.pilot = cast(response);
      }
    }),
    start: flow(function* (spaceId: string) {
      yield self.startRequest.send(api.flyWithMeRepository.start, {spaceId});
    }),
    stop: flow(function* (spaceId: string) {
      yield self.stopRequest.send(api.flyWithMeRepository.stop, {spaceId});
    })
  }));

export {FlyWithMeStore};
