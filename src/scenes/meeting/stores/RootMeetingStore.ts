import {types} from 'mobx-state-tree';

import {ResetModel} from 'core/models';

import {MeetingRoomStore} from './MeetingRoomStore';

const RootMeetingStore = types.compose(
  ResetModel,
  types
    .model('RootMeetingStore', {
      isKicked: false,
      selectedParticipant: types.maybe(types.union(types.string, types.number)),
      meetingRoomStore: types.optional(MeetingRoomStore, {})
    })
    .actions((self) => ({
      setKicked(kick: boolean) {
        self.isKicked = kick;
      },
      selectParticipant(uid?: string | number) {
        self.selectedParticipant = uid;
      }
    }))
);

export {RootMeetingStore};
