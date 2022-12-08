import {types} from 'mobx-state-tree';

import {ProfileStore} from './ProfileStore';
import {NotificationsStore} from './NotificationsStore';
import {FlyToMeStore} from './FlyToMeStore';
import {ScreenShareStore} from './ScreenShareStore';
import {SocialStore} from './SocialStore';
import {CalendarStore} from './CalendarStore';
import {MinimapStore} from './MinimapStore';
import {OnlineUsersStore} from './OnlineUsersStore';
import {ProfileMenuStore} from './ProfileMenuStore';
import {OdysseyStore} from './OdysseyStore';
import {MutualConnectionsStore} from './MutualConnectionsStore';

const RootWidgetsStore = types.model('RootWidgetsStore', {
  profileStore: types.optional(ProfileStore, {}),
  notificationsStore: types.optional(NotificationsStore, {}),
  profileMenuStore: types.optional(ProfileMenuStore, {}), // TODO: OLD
  minimapStore: types.optional(MinimapStore, {}),
  flyToMeStore: types.optional(FlyToMeStore, {}),
  screenShareStore: types.optional(ScreenShareStore, {}),
  socialStore: types.optional(SocialStore, {}),
  calendarStore: types.optional(CalendarStore, {}),
  onlineUsersStore: types.optional(OnlineUsersStore, {}),
  odysseyStore: types.optional(OdysseyStore, {}),
  mutualConnectionsStore: types.optional(MutualConnectionsStore, {})
});

export {RootWidgetsStore};
