import {Instance, types} from 'mobx-state-tree';

const UserSpaceDetails = types.model('UserSpaceDetails', {
  id: types.string,
  name: types.string,
  ownedById: types.string,
  name_hash: types.string,
  created_at: types.string,
  updated_at: types.maybe(types.string),
  uiTypeId: types.string,
  parentId: types.string,
  minimap: types.number,
  visible: types.number,
  isAdmin: types.number,
  spaceTypeName: types.string
});

export interface UserSpaceDetailsInterface extends Instance<typeof UserSpaceDetails> {}

export {UserSpaceDetails};
