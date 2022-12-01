import {types} from 'mobx-state-tree';

import {ProfileMenuStore} from './ProfileMenuStore';
import {FlyToMeStore} from './FlyToMeStore';
import {ScreenShareStore} from './ScreenShareStore';
import {SocialStore} from './SocialStore';

const RootWidgetsStore = types.model('RootWidgetsStore', {
  profileMenuStore: types.optional(ProfileMenuStore, {}),
  flyToMeStore: types.optional(FlyToMeStore, {}),
  screenShareStore: types.optional(ScreenShareStore, {}),
  socialStore: types.optional(SocialStore, {})
});

export {RootWidgetsStore};
