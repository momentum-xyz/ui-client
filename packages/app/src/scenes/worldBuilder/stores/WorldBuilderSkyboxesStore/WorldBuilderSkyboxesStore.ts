import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

// import {api, ValidationResponse} from 'api';
import {WorldBuilderSkybox, WorldBuilderSkyboxInterface} from './models';

const skyboxes: WorldBuilderSkyboxInterface[] = [
  {
    id: '658611b8-a86a-4bf0-a956-12129b06dbfd',
    name: 'Alpha',
    image: 'https://dev.odyssey.ninja/api/v3/render/get/765f5151d69276d61044a24a2867b398'
  },
  {
    id: '103dc7a9-08be-4d8e-a5a7-0df9b7eff35b',
    name: 'SNI',
    image: 'https://dev.odyssey.ninja/api/v3/render/get/8af43f9895d7a50683818feef7bc34ab'
  },
  {
    id: '221d418e-4a5f-4910-acf4-861970f2175e',
    name: 'Kusama',
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
    saveSelectedItem() {
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
