import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

// import {api, ValidationResponse} from 'api';
import {WorldBuilderSkybox, WorldBuilderSkyboxInterface} from './models';

const skyboxes: WorldBuilderSkyboxInterface[] = [
  {
    id: '1',
    name: 'Skybox 1',
    image: 'https://dev.odyssey.ninja/api/v3/render/get/765f5151d69276d61044a24a2867b398'
  },
  {
    id: '2',
    name: 'Skybox 2',
    image: 'https://dev.odyssey.ninja/api/v3/render/get/8af43f9895d7a50683818feef7bc34ab'
  },
  {
    id: '3',
    name: 'Skybox 3',
    image: 'https://dev.odyssey.ninja/api/v3/render/get/03ce359d18bfc0fe977bd66ab471d222'
  }
];

const WorldBuilderSkyboxesStore = types
  .compose(
    ResetModel,
    types.model('WorldBuilderSkyboxesStore', {
      request: types.optional(RequestModel, {}),

      items: types.optional(types.array(WorldBuilderSkybox), []),
      selectedItemId: types.maybe(types.string)
    })
  )
  .actions((self) => ({
    fetchItems: flow(function* () {
      // TODO
      self.items = cast(skyboxes);
      self.selectedItemId = self.items[0].id;
      yield Promise.resolve(skyboxes);
    }),
    selectItem(item: WorldBuilderSkyboxInterface) {
      self.selectedItemId = item.id;
    },
    updateItem() {
      // TODO
      return Promise.resolve();
    }
  }))
  .views((self) => ({
    get selectedItem(): WorldBuilderSkyboxInterface | undefined {
      return self.items.find((item) => item.id === self.selectedItemId);
    }
  }));

export {WorldBuilderSkyboxesStore};
