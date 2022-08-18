import {types} from 'mobx-state-tree';

import {ResetModel} from 'core/models';

import {MeetingRoomStore} from './MeetingRoomStore';

const RootMeetingStore = types.compose(
  ResetModel,
  types
    .model('RootMeetingStore', {
      isKicked: false,
      meetingRoomStore: types.optional(MeetingRoomStore, {})
    })
    .actions((self) => ({
      setKicked(kick: boolean): void {
        self.isKicked = kick;
      }
    }))
);

export {RootMeetingStore};
