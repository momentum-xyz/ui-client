import {Instance, types} from 'mobx-state-tree';

const SkyboxItem = types.model('SkyboxItem', {
  id: types.optional(types.string, ''),
  name: types.string,
  is_public: types.maybe(types.boolean),
  artist_name: types.optional(types.string, '')
});

export type SkyboxItemModelType = Instance<typeof SkyboxItem>;

export {SkyboxItem};
