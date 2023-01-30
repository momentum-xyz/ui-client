import {cast, flow, types} from 'mobx-state-tree';
import {Dialog, RequestModel, ResetModel} from '@momentum-xyz/core';
import {ImageSizeEnum} from '@momentum-xyz/ui-kit';
import {AttributeNameEnum} from '@momentum-xyz/sdk';

import {Asset3d, Asset3dInterface} from 'core/models';
import {api, FetchAssets3dResponse, GetSpaceAttributeResponse, UploadImageResponse} from 'api';
import {appVariables} from 'api/constants';
import {Asset3dCategoryEnum, PluginIdEnum} from 'api/enums';

const UNITY_SKYBOX_ASSET_ID = '313a597a-8b9a-47a7-9908-52bdc7a21a3e';

const SkyboxSelectorStore = types
  .compose(
    ResetModel,
    types.model('SkyboxSelectorStore', {
      request: types.optional(RequestModel, {}),
      selectRequest: types.optional(RequestModel, {}),
      worldSettingsRequest: types.optional(RequestModel, {}),

      items: types.optional(types.array(Asset3d), []),
      selectedItemId: types.maybe(types.string),
      currentItemId: types.maybe(types.string),
      userSkyboxes: types.optional(types.array(Asset3d), []),

      uploadDialog: types.optional(Dialog, {}),
      createSkyboxRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    _fetchItems: flow(function* (worldId: string) {
      const assets3d: FetchAssets3dResponse = yield self.request.send(
        api.assets3dRepository.fetchAssets3d,
        {category: Asset3dCategoryEnum.SKYBOX, worldId}
      );
      console.log('Assets3d response:', assets3d);
      if (!assets3d) {
        console.error('Error loading assets3d');
        return;
      }

      yield self.fetchUserSkyboxes(worldId);

      const skyboxes =
        assets3d.map(({id, meta: {name, preview_hash}}) => ({
          id,
          name,
          image:
            // FIXME - temp until proper preview images are available
            preview_hash
              ? `${appVariables.RENDER_SERVICE_URL}/texture/${ImageSizeEnum.S3}/${preview_hash}`
              : 'https://dev.odyssey.ninja/api/v3/render/get/03ce359d18bfc0fe977bd66ab471d222'
        })) || [];

      self.items = cast(skyboxes);
      self.selectedItemId = self.items[0].id;
      yield Promise.resolve(skyboxes);
    }),
    get fetchItems() {
      return this._fetchItems;
    },
    set fetchItems(value) {
      this._fetchItems = value;
    },
    fetchUserSkyboxes: flow(function* (spaceId: string) {
      const response: GetSpaceAttributeResponse | undefined = yield self.createSkyboxRequest.send(
        api.spaceAttributeRepository.getSpaceAttribute,
        {
          spaceId,
          plugin_id: PluginIdEnum.CORE,
          attribute_name: AttributeNameEnum.SKYBOX_LIST
        }
      );
      const skyboxes: Asset3dInterface[] =
        ((response as any)?.skyboxes || []).map(({name, hash}: any) => ({
          id: hash,
          isUserAttribute: true,
          name,
          image: hash
            ? `${appVariables.RENDER_SERVICE_URL}/texture/${ImageSizeEnum.S3}/${hash}`
            : 'https://dev.odyssey.ninja/api/v3/render/get/03ce359d18bfc0fe977bd66ab471d222'
        })) || [];
      self.userSkyboxes = cast(skyboxes);
    }),
    selectItem(item: Asset3dInterface) {
      self.selectedItemId = item.id;
    },
    saveItem: flow(function* (item: Asset3dInterface, worldId: string) {
      self.currentItemId = item.id;

      if (item.isUserAttribute) {
        return;
      }

      const {spaces} = yield self.worldSettingsRequest.send(
        api.spaceAttributeRepository.getSpaceAttribute,
        {
          spaceId: worldId,
          plugin_id: PluginIdEnum.CORE,
          attribute_name: AttributeNameEnum.WORLD_SETTINGS,
          sub_attribute_key: 'spaces'
        }
      );

      yield self.selectRequest.send(api.spaceInfoRepository.patchSpaceInfo, {
        spaceId: spaces.skybox,
        asset_3d_id: item.id
      });
    }),
    uploadSkybox: flow(function* (worldId: string, file: File, name: string) {
      const uploadImageResponse: UploadImageResponse = yield self.createSkyboxRequest.send(
        api.mediaRepository.uploadImage,
        {file}
      );

      if (!uploadImageResponse) {
        console.log('Failed to upload image');
        return false;
      }

      const {hash} = uploadImageResponse;
      console.log('Upload image response:', uploadImageResponse, hash);

      const {spaces} = yield self.createSkyboxRequest.send(
        api.spaceAttributeRepository.getSpaceAttribute,
        {
          spaceId: worldId,
          plugin_id: PluginIdEnum.CORE,
          attribute_name: AttributeNameEnum.WORLD_SETTINGS,
          sub_attribute_key: 'spaces'
        }
      );

      // TODO we might no need this if this asset_3d_id is already set for all worlds
      // but for now let's set it
      yield self.selectRequest.send(api.spaceInfoRepository.patchSpaceInfo, {
        spaceId: spaces.skybox,
        asset_3d_id: UNITY_SKYBOX_ASSET_ID
      });

      yield self.createSkyboxRequest.send(api.spaceAttributeRepository.setSpaceAttribute, {
        spaceId: spaces.skybox,
        // spaceId: worldId,
        plugin_id: PluginIdEnum.CORE,
        attribute_name: AttributeNameEnum.SKYBOX_CUSTOM,
        value: {render_hash: hash}
      });

      yield self.createSkyboxRequest.send(api.spaceAttributeRepository.setSpaceAttribute, {
        spaceId: worldId,
        plugin_id: PluginIdEnum.CORE,
        attribute_name: AttributeNameEnum.SKYBOX_LIST,
        value: {
          skyboxes: [
            ...self.userSkyboxes
              .filter((d: any) => d.hash !== hash)
              .map((d: any) => ({hash: d.id, name: d.name})),
            {hash, name: name || '-'}
          ]
        }
      });

      self.fetchUserSkyboxes(worldId);

      return self.createSkyboxRequest.isDone;
    }),
    removeUserSkybox: flow(function* (worldId: string, hash: string) {
      const userSkyboxes = self.userSkyboxes.filter((d: any) => d.id !== hash);
      yield self.createSkyboxRequest.send(api.spaceAttributeRepository.setSpaceAttribute, {
        spaceId: worldId,
        plugin_id: PluginIdEnum.CORE,
        attribute_name: AttributeNameEnum.SKYBOX_LIST,
        value: {skyboxes: userSkyboxes.map((d) => ({hash: d.id, name: d.name}))}
      });

      self.userSkyboxes = cast(userSkyboxes);
      return self.createSkyboxRequest.isDone;
    })
  }))
  .views((self) => ({
    get selectedItem(): Asset3dInterface | undefined {
      return this.allSkyboxes.find((item) => item.id === self.selectedItemId);
    },
    get currentItem(): Asset3dInterface | undefined {
      return this.allSkyboxes.find((item) => item.id === self.currentItemId);
    },
    get isUploadPending(): boolean {
      return self.createSkyboxRequest.isPending;
    },
    get allSkyboxes(): Asset3dInterface[] {
      return [...self.items, ...self.userSkyboxes.map((d: any) => ({...d, isUserAttribute: true}))];
    }
  }));

export {SkyboxSelectorStore};
