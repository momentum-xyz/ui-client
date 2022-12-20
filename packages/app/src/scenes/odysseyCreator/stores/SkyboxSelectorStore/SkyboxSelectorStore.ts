import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';
import {AttributeNameEnum} from '@momentum-xyz/sdk';

import {Asset3d, Asset3dInterface} from 'core/models';
import {api, FetchAssets3dResponse} from 'api';
import {appVariables} from 'api/constants';
import {Asset3dCategoryEnum, PluginIdEnum} from 'api/enums';

const SkyboxSelectorStore = types
  .compose(
    ResetModel,
    types.model('SkyboxSelectorStore', {
      request: types.optional(RequestModel, {}),
      selecteRequest: types.optional(RequestModel, {}),
      worldSettingsRequest: types.optional(RequestModel, {}),

      items: types.optional(types.array(Asset3d), []),
      selectedItemId: types.maybe(types.string),
      currentItemId: types.maybe(types.string)
    })
  )
  .actions((self) => ({
    fetchItems: flow(function* (worldId: string) {
      const assets3d: FetchAssets3dResponse = yield self.request.send(
        api.assets3dRepository.fetchAssets3d,
        {category: Asset3dCategoryEnum.SKYBOX, worldId}
      );
      console.log('Assets3d response:', assets3d);
      if (!assets3d) {
        console.error('Error loading assets3d');
        return;
      }

      const skyboxes =
        assets3d.map(({id, meta: {name, previewImage}}) => ({
          id,
          name,
          image:
            // FIXME - temp until proper preview images are available
            previewImage
              ? `${appVariables.RENDER_SERVICE_URL}/get/${previewImage}`
              : 'https://dev.odyssey.ninja/api/v3/render/get/03ce359d18bfc0fe977bd66ab471d222'
        })) || [];

      self.items = cast(skyboxes);
      self.selectedItemId = self.items[0].id;
      yield Promise.resolve(skyboxes);
    }),
    selectItem(item: Asset3dInterface) {
      self.selectedItemId = item.id;
    },
    saveItem: flow(function* (item: Asset3dInterface, worldId: string) {
      self.currentItemId = item.id;

      const {spaces} = yield self.worldSettingsRequest.send(
        api.spaceAttributeRepository.getSpaceAttribute,
        {
          spaceId: worldId,
          plugin_id: PluginIdEnum.CORE,
          attribute_name: AttributeNameEnum.WORLD_SETTINGS,
          sub_attribute_key: 'spaces'
        }
      );

      yield self.selecteRequest.send(api.spaceInfoRepository.patchSpaceInfo, {
        spaceId: spaces.skybox,
        asset_3d_id: item.id
      });
    })
  }))
  .views((self) => ({
    get selectedItem(): Asset3dInterface | undefined {
      return self.items.find((item) => item.id === self.selectedItemId);
    },
    get currentItem(): Asset3dInterface | undefined {
      return self.items.find((item) => item.id === self.currentItemId);
    }
  }));

export {SkyboxSelectorStore};
