import {types} from 'mobx-state-tree';

import {ProfileStore} from './ProfileStore';
import {ProfileMenuStore} from './ProfileMenuStore';
import {FlyToMeStore} from './FlyToMeStore';
import {ScreenShareStore} from './ScreenShareStore';
import {SocialStore} from './SocialStore';
import {CalendarStore} from './CalendarStore';
import {MinimapStore} from './MinimapStore';
import {OnlineUsersStore} from './OnlineUsersStore';

const RootWidgetsStore = types.model('RootWidgetsStore', {
  profileStore: types.optional(ProfileStore, {}),
  profileMenuStore: types.optional(ProfileMenuStore, {}),
  minimapStore: types.optional(MinimapStore, {}),
  flyToMeStore: types.optional(FlyToMeStore, {}),
  screenShareStore: types.optional(ScreenShareStore, {}),
  socialStore: types.optional(SocialStore, {}),
  calendarStore: types.optional(CalendarStore, {}),
  onlineUsersStore: types.optional(OnlineUsersStore, {})
});

export {RootWidgetsStore};
