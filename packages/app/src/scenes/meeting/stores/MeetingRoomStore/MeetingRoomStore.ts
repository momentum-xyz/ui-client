import {flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum/core';

import {api} from 'api';

const MeetingRoomStore = types
  .compose(
    ResetModel,
    types.model('MeetingRoomStore', {
      kickRequest: types.optional(RequestModel, {}),
      muteRequest: types.optional(RequestModel, {}),
      muteAllRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    muteUser: flow(function* (spaceId: string, userId: string) {
      yield self.muteRequest.send(api.meetingRepository.muteUser, {spaceId, userId});
    }),
    muteAllUsers: flow(function* (spaceId: string) {
      yield self.muteAllRequest.send(api.meetingRepository.muteAllUsers, {spaceId});
    }),
    kickUser: flow(function* (spaceId: string, userId: string) {
      yield self.kickRequest.send(api.meetingRepository.kickUser, {spaceId, userId});
    })
  }));

export {MeetingRoomStore};
