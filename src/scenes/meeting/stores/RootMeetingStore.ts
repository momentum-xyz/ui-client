import {types} from 'mobx-state-tree';

import {ResetModel} from 'core/models';

import {MeetingRoomStore} from './MeetingRoomStore';

const LAST_SPACE_TIMER_MS = 15000;

const RootMeetingStore = types.compose(
  ResetModel,
  types
    .model('RootMeetingStore', {
      isTable: false,
      isKicked: false,
      spaceId: types.maybeNull(types.string),
      lastSpaceId: types.maybeNull(types.string),
      meetingRoomStore: types.optional(MeetingRoomStore, {})
    })
    .volatile(() => ({
      lastSpaceTimer: setTimeout(() => {}, 0)
    }))
    .actions((self) => ({
      join(spaceId: string, isTable: boolean): void {
        self.spaceId = spaceId;
        self.isTable = isTable;
        self.isKicked = false;
        self.lastSpaceId = null;

        clearTimeout(self.lastSpaceTimer);
      },
      leave(isKicked = false): void {
        if (!isKicked && !self.isTable) {
          self.lastSpaceId = self.spaceId;

          self.lastSpaceTimer = setTimeout(() => {
            self.lastSpaceId = null;
          }, LAST_SPACE_TIMER_MS);
        }

        self.spaceId = null;
        self.isTable = false;
        self.isKicked = false;
      }
    }))
    .views((self) => ({
      get canRejoin(): boolean {
        return !!self.lastSpaceId && !self.isKicked;
      }
    }))
);

export {RootMeetingStore};
