import {flow, types} from 'mobx-state-tree';

import {RequestModel, ResetModel} from 'core/models';
import {api} from 'api';

const MeetingRoomStore = types
  .compose(
    ResetModel,
    types.model('MeetingRoomStore', {
      request: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    kickUser: flow(function* (spaceId?: string, userId?: string | number) {
      yield self.request.send(api.meetingRepository.kickUser, {
        spaceId,
        userId
      });
    })
  }));

export {MeetingRoomStore};
