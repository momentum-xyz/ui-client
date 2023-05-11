import {types} from 'mobx-state-tree';

import {PreviewOdysseyStore} from './PreviewOdysseyStore';
import {NotificationsStore} from './NotificationsStore';
import {FlyToMeStore} from './FlyToMeStore';
import {ScreenShareStore} from './ScreenShareStore';
import {TextChatStore} from './TextChatStore';
import {CalendarStore} from './CalendarStore';
import {MinimapStore} from './MinimapStore';

const RootWidgetsStore = types
  .model('RootWidgetsStore', {
    previewOdysseyStore: types.optional(PreviewOdysseyStore, {}),
    notificationsStore: types.optional(NotificationsStore, {}),
    minimapStore: types.optional(MinimapStore, {}),
    flyToMeStore: types.optional(FlyToMeStore, {}),
    screenShareStore: types.optional(ScreenShareStore, {}),
    textChatStore: types.optional(TextChatStore, {}),
    calendarStore: types.optional(CalendarStore, {})
  })
  .views((self) => ({
    get signInDialogAvailable(): boolean {
      return !self.calendarStore.dialog.isOpen && !self.minimapStore.dialog.isOpen;
    }
  }));

export {RootWidgetsStore};
