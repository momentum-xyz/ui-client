import {Instance, types} from 'mobx-state-tree';

export const NftItem = types.model('NftItem', {
  id: types.identifierNumber,
  collectionId: types.number,
  name: types.string,
  description: types.maybe(types.string),
  image: types.optional(types.string, '')
});

export interface NftItemInterface extends Instance<typeof NftItem> {}
