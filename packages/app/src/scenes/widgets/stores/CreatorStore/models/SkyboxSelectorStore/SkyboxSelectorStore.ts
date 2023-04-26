import {cast, flow, types} from 'mobx-state-tree';
import {Dialog, RequestModel, ResetModel} from '@momentum-xyz/core';
import {AttributeNameEnum} from '@momentum-xyz/sdk';
import {ImageSizeEnum} from '@momentum-xyz/ui-kit';

import {Asset3dInterface} from 'core/models';
import {api, UploadImageResponse} from 'api';
import {PluginIdEnum} from 'api/enums';
import {appVariables} from 'api/constants';

// const UNITY_SKYBOX_ASSET_ID = '313a597a-8b9a-47a7-9908-52bdc7a21a3e';
const PAGE_SIZE = 5;

const SkyboxDatabaseModel = types.model({
  name: types.string
});

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
      defaultSkyboxes: types.optional(types.map(SkyboxDatabaseModel), {}),
      userSkyboxes: types.optional(types.map(SkyboxDatabaseModel), {}),

      skyboxPageCnt: types.optional(types.number, 0),
      skyboxCurrentPage: types.optional(types.number, 0),

      skyboxToDeleteId: types.maybe(types.string),
      uploadDialog: types.optional(Dialog, {}),
      deleteDialog: types.optional(Dialog, {})
    })
  )
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
      return [
        ...Object.entries(self.userSkyboxes.toJSON()).map(
          ([id, d]) =>
            ({
              id,
              ...d,
              isUserAttribute: true,
              image: self.generateImageFromHash(id)
            } as Asset3dInterface)
        ),
        ...Object.entries(self.defaultSkyboxes.toJSON()).map(
          ([id, d]) =>
            ({
              id,
              ...d,
              isUserAttribute: false,
              image: self.generateImageFromHash(id)
            } as Asset3dInterface)
        )
      ];
    },
    get communitySkyboxesList(): Asset3dInterface[] {
      return Object.entries(self.defaultSkyboxes.toJSON()).map(
        ([id, d]) =>
          ({
            id,
            ...d,
            isUserAttribute: false,
            image: self.generateImageFromHash(id)
          } as Asset3dInterface)
      );
    },
    get userSkyboxesList(): Asset3dInterface[] {
      return Object.entries(self.userSkyboxes.toJSON()).map(
        ([id, d]) =>
          ({
            id,
            ...d,
            isUserAttribute: true,
            image: self.generateImageFromHash(id)
          } as Asset3dInterface)
      );
    },
    get currPageSkyboxes(): Asset3dInterface[] {
      const start = self.skyboxCurrentPage * PAGE_SIZE;
      const end = start + PAGE_SIZE;

      return this.allSkyboxes.slice(start, end);
    },
    get pages(): number[] {
      return Array.from(Array(self.skyboxPageCnt).keys());
    }
  }))
  .actions((self) => ({
    fetchItems: flow(function* (worldId: string, userId: string) {
      console.log('Fetching skyboxes for world:', worldId, 'and user:', userId);

      yield self.fetchDefaultSkyboxes();
      yield self.fetchUserSkyboxes(worldId, userId);

      // const {objects} = yield self.worldSettingsRequest.send(
      //   api.spaceAttributeRepository.getSpaceAttribute,
      //   {
      //     spaceId: worldId,
      //     plugin_id: PluginIdEnum.CORE,
      //     attribute_name: AttributeNameEnum.WORLD_SETTINGS,
      //     sub_attribute_key: 'objects'
      //   }
      // );

      const activeSkyboxData = yield self.createSkyboxRequest.send(
        api.spaceAttributeRepository.getSpaceAttribute,
        {
          // spaceId: objects.skybox,
          spaceId: worldId,
          plugin_id: PluginIdEnum.CORE,
          attribute_name: AttributeNameEnum.ACTIVE_SKYBOX
        }
      );

      self.selectedItemId = activeSkyboxData?.render_hash || self.allSkyboxes?.[0]?.id;
      self.currentItemId = self.selectedItemId;

      self.skyboxPageCnt = Math.ceil(self.allSkyboxes.length / PAGE_SIZE);
      self.skyboxCurrentPage = 0;
    }),
    fetchDefaultSkyboxes: flow(function* () {
      const response = yield self.fetchSkyboxRequest.send(
        api.spaceAttributeRepository.getSpaceAttribute,
        {
          spaceId: appVariables.NODE_ID,
          plugin_id: PluginIdEnum.CORE,
          attribute_name: AttributeNameEnum.SKYBOX_LIST
        }
      );

      self.defaultSkyboxes = cast(response || {});
    }),
    fetchUserSkyboxes: flow(function* (spaceId: string, userId: string) {
      const response = yield self.fetchSkyboxRequest.send(
        api.spaceUserAttributeRepository.getSpaceUserAttribute,
        {
          spaceId: appVariables.NODE_ID,
          userId,
          pluginId: PluginIdEnum.CORE,
          attributeName: AttributeNameEnum.SKYBOX_LIST
        }
      );

      self.userSkyboxes = cast(response || {});
    }),
    selectItem(item: Asset3dInterface) {
      self.selectedItemId = item.id;
    },
    saveItem: flow(function* (id: string, worldId: string) {
      self.currentItemId = id;

      // const {objects} = yield self.worldSettingsRequest.send(
      //   api.spaceAttributeRepository.getSpaceAttribute,
      //   {
      //     spaceId: worldId,
      //     plugin_id: PluginIdEnum.CORE,
      //     attribute_name: AttributeNameEnum.WORLD_SETTINGS,
      //     sub_attribute_key: 'objects'
      //   }
      // );

      // yield self.worldSettingsRequest.send(api.spaceInfoRepository.patchSpaceInfo, {
      //   spaceId: objects.skybox,
      //   asset_3d_id: UNITY_SKYBOX_ASSET_ID
      // });

      yield self.createSkyboxRequest.send(api.spaceAttributeRepository.setSpaceAttribute, {
        // spaceId: objects.skybox,
        spaceId: worldId,
        plugin_id: PluginIdEnum.CORE,
        attribute_name: AttributeNameEnum.ACTIVE_SKYBOX,
        value: {render_hash: id}
      });

      return self.worldSettingsRequest.isDone;
    }),
    uploadSkybox: flow(function* (
      worldId: string,
      userId: string,
      file: File,
      name: string,
      artistName: string,
      type: 'COMMUNITY' | 'PRIVATE'
    ) {
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
        ...self.userSkyboxes.toJSON(),
        [hash]: {name, artistName, type}
      };
      yield self.createSkyboxRequest.send(api.spaceUserAttributeRepository.setSpaceUserAttribute, {
        spaceId: appVariables.NODE_ID,
        userId,
        pluginId: PluginIdEnum.CORE,
        attributeName: AttributeNameEnum.SKYBOX_LIST,
        value
      });

      yield self.saveItem(hash, worldId);
      yield self.fetchUserSkyboxes(worldId, userId);
      self.skyboxPageCnt = Math.ceil(self.allSkyboxes.length / PAGE_SIZE);

      return self.createSkyboxRequest.isDone;
    }),
    removeUserSkybox: flow(function* (worldId: string, userId: string, hash: string) {
      if (hash === self.currentItemId) {
        return;
      }

      const value = {...self.userSkyboxes.toJSON()};
      delete value[hash];
      yield self.createSkyboxRequest.send(api.spaceUserAttributeRepository.setSpaceUserAttribute, {
        spaceId: appVariables.NODE_ID,
        userId,
        pluginId: PluginIdEnum.CORE,
        attributeName: AttributeNameEnum.SKYBOX_LIST,
        value
      });

      yield self.fetchUserSkyboxes(worldId, userId);
      self.skyboxPageCnt = Math.ceil(self.allSkyboxes.length / PAGE_SIZE);
      if (self.skyboxCurrentPage >= self.skyboxPageCnt) {
        self.skyboxCurrentPage = self.skyboxPageCnt - 1;
      }

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
    },
    generateImageFromHash: function (hash: string | undefined) {
      // FIXME - temp until proper preview images are available
      return hash
        ? `${appVariables.RENDER_SERVICE_URL}/texture/${ImageSizeEnum.S3}/${hash}`
        : 'https://dev.odyssey.ninja/api/v3/render/get/03ce359d18bfc0fe977bd66ab471d222';
    },
    changePage: function (page: number) {
      self.skyboxCurrentPage = page;
    },
    nextPage: function () {
      self.skyboxCurrentPage += 1;
      if (self.skyboxCurrentPage >= self.skyboxPageCnt) {
        self.skyboxCurrentPage = 0;
      }
    },
    prevPage: function () {
      self.skyboxCurrentPage -= 1;
      if (self.skyboxCurrentPage < 0) {
        self.skyboxCurrentPage = self.skyboxPageCnt - 1;
      }
    }
  }));

export {SkyboxSelectorStore};
