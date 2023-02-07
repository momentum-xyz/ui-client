import {types, Instance} from 'mobx-state-tree';

const UserProfile = types.model('UserProfile', {
  bio: types.maybe(types.string),
  location: types.maybe(types.string),
  avatarHash: types.maybe(types.string),
  profileLink: types.maybe(types.string)
});

export interface UserProfileModelInterface extends Instance<typeof UserProfile> {}

export {UserProfile};
