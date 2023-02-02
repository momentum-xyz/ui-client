import {cast, flow, types} from 'mobx-state-tree';
import {Dialog, RequestModel, ResetModel} from '@momentum-xyz/core';
import {AttributeNameEnum} from '@momentum-xyz/sdk';

import {Asset3d, Asset3dInterface} from 'core/models';
import {api, UploadImageResponse} from 'api';
import {PluginIdEnum} from 'api/enums';

import {
  extractSkyboxAsset3dArrayFromImageHash,
  generateImageFromHash,
  generateImageHashFromSkyboxAsset3dArray
} from '../../utils';

const UNITY_SKYBOX_ASSET_ID = '313a597a-8b9a-47a7-9908-52bdc7a21a3e';

const SkyboxSelectorStore = types
  .compose(
    ResetModel,
    types.model('SkyboxSelectorStore', {
      request: types.optional(RequestModel, {}),
      worldSettingsRequest: types.optional(RequestModel, {}),
      createSkyboxRequest: types.optional(RequestModel, {}),
      fetchSkyboxRequest: types.optional(RequestModel, {}),

      selectedItemId: types.maybe(types.string),
      currentItemId: types.maybe(types.string),
      defaultSkyboxes: types.optional(types.array(Asset3d), []),
      userSkyboxes: types.optional(types.array(Asset3d), []),

      skyboxToDeleteId: types.maybe(types.string),
      uploadDialog: types.optional(Dialog, {}),
      deleteDialog: types.optional(Dialog, {})
    })
  )
  .actions((self) => ({
    fetchItems: flow(function* (worldId: string, userId: string) {
      console.log('Fetching skyboxes for world:', worldId, 'and user:', userId);

      yield self.fetchDefaultSkyboxes(worldId);
      yield self.fetchUserSkyboxes(worldId, userId);

      const {spaces} = yield self.worldSettingsRequest.send(
        api.spaceAttributeRepository.getSpaceAttribute,
        {
          spaceId: worldId,
          plugin_id: PluginIdEnum.CORE,
          attribute_name: AttributeNameEnum.WORLD_SETTINGS,
          sub_attribute_key: 'spaces'
        }
      );

      const customSkyboxData = yield self.createSkyboxRequest.send(
        api.spaceAttributeRepository.getSpaceAttribute,
        {
          spaceId: spaces.skybox,
          plugin_id: PluginIdEnum.CORE,
          attribute_name: AttributeNameEnum.SKYBOX_CUSTOM
        }
      );

      const allSkyboxes = [...self.defaultSkyboxes, ...self.userSkyboxes];
      self.selectedItemId = customSkyboxData?.render_hash || (allSkyboxes[0] || {id: undefined}).id;

      yield Promise.resolve(allSkyboxes);
    }),
    fetchDefaultSkyboxes: flow(function* (spaceId: string) {
      const response = yield self.fetchSkyboxRequest.send(
        api.spaceAttributeRepository.getSpaceAttribute,
        {
          spaceId,
          plugin_id: PluginIdEnum.CORE,
          attribute_name: AttributeNameEnum.SKYBOX_LIST
        }
      );

      if (!response) {
        self.defaultSkyboxes = cast([]);
        return;
      }

      const skyboxes = extractSkyboxAsset3dArrayFromImageHash(response.image_hash);
      self.defaultSkyboxes = cast(skyboxes);
    }),
    fetchUserSkyboxes: flow(function* (spaceId: string, userId: string) {
      const response = yield self.fetchSkyboxRequest.send(
        api.spaceUserAttributeRepository.getSpaceUserAttribute,
        {
          spaceId,
          userId,
          pluginId: PluginIdEnum.CORE,
          attributeName: AttributeNameEnum.SKYBOX_LIST
        }
      );

      if (!response) {
        self.userSkyboxes = cast([]);
        return;
      }

      // tmp fix for old data
      if (response.skyboxes) {
        const skyboxes: Asset3dInterface[] =
          ((response as any)?.skyboxes || []).map(({name, hash}: any) => ({
            id: hash,
            isUserAttribute: false,
            name,
            image: generateImageFromHash(hash)
          })) || [];

        const value = {image_hash: generateImageHashFromSkyboxAsset3dArray(skyboxes)};

        yield self.createSkyboxRequest.send(
          api.spaceUserAttributeRepository.setSpaceUserAttribute,
          {
            spaceId,
            userId,
            pluginId: PluginIdEnum.CORE,
            attributeName: AttributeNameEnum.SKYBOX_LIST,
            value
          }
        );

        self.userSkyboxes = cast(skyboxes);
        return;
      }

      const skyboxes = extractSkyboxAsset3dArrayFromImageHash(response.image_hash);
      self.userSkyboxes = cast(skyboxes);
    }),
    selectItem(item: Asset3dInterface) {
      self.selectedItemId = item.id;
    },
    saveItem: flow(function* (id: string, isUserAttribute: boolean, worldId: string) {
      self.currentItemId = id;

      const {spaces} = yield self.worldSettingsRequest.send(
        api.spaceAttributeRepository.getSpaceAttribute,
        {
          spaceId: worldId,
          plugin_id: PluginIdEnum.CORE,
          attribute_name: AttributeNameEnum.WORLD_SETTINGS,
          sub_attribute_key: 'spaces'
        }
      );

      yield self.worldSettingsRequest.send(api.spaceInfoRepository.patchSpaceInfo, {
        spaceId: spaces.skybox,
        asset_3d_id: isUserAttribute ? UNITY_SKYBOX_ASSET_ID : id
      });
      if (isUserAttribute) {
        yield self.createSkyboxRequest.send(api.spaceAttributeRepository.setSpaceAttribute, {
          spaceId: spaces.skybox,
          plugin_id: PluginIdEnum.CORE,
          attribute_name: AttributeNameEnum.SKYBOX_CUSTOM,
          value: {render_hash: id}
        });
      }

      return self.worldSettingsRequest.isDone;
    }),
    uploadSkybox: flow(function* (worldId: string, userId: string, file: File, name: string) {
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

      const value = {
        image_hash: {...generateImageHashFromSkyboxAsset3dArray(self.userSkyboxes), [name]: hash}
      };
      yield self.createSkyboxRequest.send(api.spaceUserAttributeRepository.setSpaceUserAttribute, {
        spaceId: worldId,
        userId,
        pluginId: PluginIdEnum.CORE,
        attributeName: AttributeNameEnum.SKYBOX_LIST,
        value
      });

      yield self.saveItem(hash, true, worldId);
      yield self.fetchUserSkyboxes(worldId, userId);

      return self.createSkyboxRequest.isDone;
    }),
    removeUserSkybox: flow(function* (worldId: string, userId: string, hash: string) {
      const value = {
        skyboxes: [
          ...self.userSkyboxes
            .filter((d: any) => d.id !== hash)
            .map((d: any) => ({hash: d.id, name: d.name}))
        ]
      };

      yield self.createSkyboxRequest.send(api.spaceUserAttributeRepository.setSpaceUserAttribute, {
        spaceId: worldId,
        userId,
        pluginId: PluginIdEnum.CORE,
        attributeName: AttributeNameEnum.SKYBOX_LIST,
        value
      });

      yield self.fetchUserSkyboxes(worldId, userId);
      self.closeSkyboxDeletion();
      return self.createSkyboxRequest.isDone;
    }),
    openSkyboxDeletion: function (skyboxToDeleteId: string) {
      self.skyboxToDeleteId = skyboxToDeleteId;
      self.deleteDialog.open();
    },
    closeSkyboxDeletion: function () {
      self.skyboxToDeleteId = undefined;
      self.deleteDialog.close();
    }
  }))
  .views((self) => ({
    get selectedItem(): Asset3dInterface | undefined {
      return this.allSkyboxes.find((item) => item.id === self.selectedItemId);
    },
    get skyboxToDelete(): Asset3dInterface | undefined {
      return this.allSkyboxes.find((item) => item.id === self.skyboxToDeleteId);
    },
    get currentItem(): Asset3dInterface | undefined {
      return this.allSkyboxes.find((item) => item.id === self.currentItemId);
    },
    get isUploadPending(): boolean {
      return self.createSkyboxRequest.isPending;
    },
    get allSkyboxes(): Asset3dInterface[] {
      return [...self.defaultSkyboxes, ...self.userSkyboxes];
    }
  }));

export {SkyboxSelectorStore};
