import {types} from 'mobx-state-tree';

import {ResetModel} from 'core/models';

import {MeetingRoomStore} from './MeetingRoomStore';

const RootMeetingStore = types.compose(
  ResetModel,
  types.model('RootMeetingRoomStore', {
    meetingRoomStore: types.optional(MeetingRoomStore, {})
  })
);

export {RootMeetingStore};
