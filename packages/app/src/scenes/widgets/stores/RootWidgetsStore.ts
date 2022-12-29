import {types} from 'mobx-state-tree';

import {ProfileStore} from './ProfileStore';
import {NotificationsStore} from './NotificationsStore';
import {FlyToMeStore} from './FlyToMeStore';
import {ScreenShareStore} from './ScreenShareStore';
import {TextChatStore} from './TextChatStore';
import {VoiceChatStore} from './VoiceChatStore';
import {CalendarStore} from './CalendarStore';
import {MinimapStore} from './MinimapStore';
import {OnlineUsersStore} from './OnlineUsersStore';
import {OdysseyBioStore} from './OdysseyBioStore';
import {MutualConnectionsStore} from './MutualConnectionsStore';
import {MagicLinkStore} from './MagicLinkStore';

const RootWidgetsStore = types.model('RootWidgetsStore', {
  profileStore: types.optional(ProfileStore, {}),
  notificationsStore: types.optional(NotificationsStore, {}),
  minimapStore: types.optional(MinimapStore, {}),
  flyToMeStore: types.optional(FlyToMeStore, {}),
  screenShareStore: types.optional(ScreenShareStore, {}),
  textChatStore: types.optional(TextChatStore, {}),
  voiceChatStore: types.optional(VoiceChatStore, {}),
  calendarStore: types.optional(CalendarStore, {}),
  onlineUsersStore: types.optional(OnlineUsersStore, {}),
  magicLinkStore: types.optional(MagicLinkStore, {}),
  odysseyBioStore: types.optional(OdysseyBioStore, {}),
  odysseyInfoStore: types.optional(OdysseyBioStore, {}),
  mutualConnectionsStore: types.optional(MutualConnectionsStore, {})
});

export {RootWidgetsStore};
