import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';
import {AttributeNameEnum, AttributeValueInterface} from '@momentum-xyz/sdk';
import {ImageSizeEnum} from '@momentum-xyz/ui-kit';

import {PluginIdEnum} from 'api/enums';
import {appVariables} from 'api/constants';
import {SkyboxInfoFormInterface} from 'core/interfaces';
import {SkyboxItem, SkyboxItemModelType} from 'core/models';
import {
  api,
  UploadFileResponse,
  AIStyleItemInterface,
  SkyboxGenerationStatusInterface,
  GetAllSpaceUserAttributeListResponse
} from 'api';

interface SkyboxItemInterface {
  _key: string;
  artist_name: string | null;
  is_public: string | null;
  name: string | null;
}

const SkyboxSelectorStore = types
  .compose(
    ResetModel,
    types.model('SkyboxSelectorStore', {
      request: types.optional(RequestModel, {}),
      worldSettingsRequest: types.optional(RequestModel, {}),
      createSkyboxRequest: types.optional(RequestModel, {}),
      removeSkyboxRequest: types.optional(RequestModel, {}),

      selectedItemId: types.maybe(types.string),
      currentItemId: types.maybe(types.string),
      communitySkyboxes: types.optional(types.array(SkyboxItem), []),
      userSkyboxes: types.optional(types.array(SkyboxItem), []),
      fetchSkyboxRequest: types.optional(RequestModel, {}),

      fetchAIStylesRequest: types.optional(RequestModel, {}),
      fetchGeneratedSkyboxRequest: types.optional(RequestModel, {}),
      generateAISkyboxRequest: types.optional(RequestModel, {}),
      AIStyles: types.optional(types.array(types.frozen<AIStyleItemInterface>()), []),

      pendingGenerationId: types.maybe(types.string),
      pendingGenerationStatus: types.maybe(types.string),
      pendingGenerationErrorMessage: types.maybe(types.string),
      generatedSkyboxThumbUrl: types.maybe(types.string),
      generatedSkyboxPreviewUrl: types.maybe(types.string),
      generatedSkyboxFile: types.maybe(types.frozen<File>())
    })
  )
  .views((self) => ({
    get selectedItem(): SkyboxItemModelType | undefined {
      return this.allSkyboxes.find((item) => item.id === self.selectedItemId);
    },
    get currentItem(): SkyboxItemModelType | undefined {
      return this.allSkyboxes.find((item) => item.id === self.currentItemId);
    },
    get isUploadPending(): boolean {
      return self.createSkyboxRequest.isPending;
    },
    get communitySkyboxesList(): SkyboxItemModelType[] {
      return [...self.communitySkyboxes];
    },
    get userSkyboxesList(): SkyboxItemModelType[] {
      return [...self.userSkyboxes];
    },
    get allSkyboxes(): SkyboxItemModelType[] {
      return [...this.communitySkyboxesList, ...this.userSkyboxesList];
    },
    get isSkyboxGenerationPending(): boolean {
      return (
        self.generateAISkyboxRequest.isPending ||
        (!!self.pendingGenerationId &&
          !self.pendingGenerationErrorMessage &&
          self.pendingGenerationStatus !== 'complete')
      );
    },
    get isSkyboxGenerationComplete(): boolean {
      return (
        !!self.pendingGenerationId &&
        !self.pendingGenerationErrorMessage &&
        self.pendingGenerationStatus === 'complete'
      );
    },
    get skyboxGenerationError(): string | undefined {
      return self.pendingGenerationErrorMessage;
    }
  }))
  .actions((self) => ({
    async fetchItems(worldId: string, userId: string) {
      await this.fetchCommunitySkyboxes();
      await this.fetchUserSkyboxes(userId);
      await this.fetchActiveSkybox(worldId);
    },
    fetchCommunitySkyboxes: flow(function* () {
      const response: GetAllSpaceUserAttributeListResponse = yield self.fetchSkyboxRequest.send(
        api.spaceUserAttributeRepository.getAllSpaceUserAttributeList,
        {
          spaceId: appVariables.NODE_ID,
          pluginId: PluginIdEnum.CORE,
          attributeName: AttributeNameEnum.SKYBOX_LIST,
          // Fields of SkyboxItemModelType
          fields: ['name', 'is_public', 'artist_name'],
          filterField: 'is_public',
          filterValue: 'true'
        }
      );

      if (response.items) {
        const skyboxes: SkyboxItemModelType[] = response.items.map((item) => {
          const skybox = item as never as SkyboxItemInterface;
          return {
            id: skybox._key,
            name: skybox.name || '',
            artist_name: skybox.artist_name || '',
            is_public: skybox.is_public === 'true'
          };
        });

        self.communitySkyboxes = cast(skyboxes);
      }
    }),
    fetchUserSkyboxes: flow(function* (userId: string) {
      const response: AttributeValueInterface = yield self.fetchSkyboxRequest.send(
        api.spaceUserAttributeRepository.getSpaceUserAttribute,
        {
          userId,
          spaceId: appVariables.NODE_ID,
          pluginId: PluginIdEnum.CORE,
          attributeName: AttributeNameEnum.SKYBOX_LIST
        }
      );

      if (response) {
        const skyboxList: SkyboxItemModelType[] = Object.entries(response).map(([key, value]) => ({
          ...(value as SkyboxItemModelType),
          id: key
        }));

        self.userSkyboxes = cast(skyboxList);
      }
    }),
    fetchActiveSkybox: flow(function* (worldId: string) {
      const activeSkyboxData = yield self.createSkyboxRequest.send(
        api.spaceAttributeRepository.getSpaceAttribute,
        {
          spaceId: worldId,
          plugin_id: PluginIdEnum.CORE,
          attribute_name: AttributeNameEnum.ACTIVE_SKYBOX
        }
      );

      self.selectedItemId = activeSkyboxData?.render_hash || self.allSkyboxes?.[0]?.id;
      self.currentItemId = self.selectedItemId;
    }),
    updateActiveSkybox: flow(function* (id: string, worldId: string) {
      self.currentItemId = id;

      yield self.createSkyboxRequest.send(api.spaceAttributeRepository.setSpaceAttribute, {
        spaceId: worldId,
        plugin_id: PluginIdEnum.CORE,
        attribute_name: AttributeNameEnum.ACTIVE_SKYBOX,
        value: {render_hash: id}
      });

      return self.worldSettingsRequest.isDone;
    }),
    uploadSkybox: flow(function* (worldId: string, userId: string, form: SkyboxInfoFormInterface) {
      const uploadImageResponse: UploadFileResponse = yield self.createSkyboxRequest.send(
        api.mediaRepository.uploadImage,
        {file: form.file}
      );

      if (!uploadImageResponse) {
        console.log('Failed to upload image');
        return false;
      }

      const {hash} = uploadImageResponse;
      console.log('Upload image response:', uploadImageResponse, hash);

      yield self.createSkyboxRequest.send(
        api.spaceUserAttributeRepository.setSpaceUserSubAttribute,
        {
          userId,
          spaceId: appVariables.NODE_ID,
          pluginId: PluginIdEnum.CORE,
          attributeName: AttributeNameEnum.SKYBOX_LIST,
          sub_attribute_key: hash,
          sub_attribute_value: {
            name: form.name,
            artist_name: form.artistName,
            is_public: form.type === 'COMMUNITY'
          }
        }
      );

      yield self.updateActiveSkybox(hash, worldId);
      yield self.fetchUserSkyboxes(userId);
      yield self.fetchCommunitySkyboxes();

      return self.createSkyboxRequest.isDone;
    }),
    removeUserSkybox: flow(function* (userId: string, skyboxId: string) {
      yield self.removeSkyboxRequest.send(
        api.spaceUserAttributeRepository.deleteSpaceUserSubAttribute,
        {
          userId,
          spaceId: appVariables.NODE_ID,
          pluginId: PluginIdEnum.CORE,
          attributeName: AttributeNameEnum.SKYBOX_LIST,
          sub_attribute_key: skyboxId
        }
      );
    }),
    generateImageFromHash: function (hash: string | undefined) {
      // FIXME - temp until proper preview images are available
      return hash
        ? `${appVariables.RENDER_SERVICE_URL}/texture/${ImageSizeEnum.S5}/${hash}`
        : 'https://dev.odyssey.ninja/api/v3/render/get/03ce359d18bfc0fe977bd66ab471d222';
    },
    fetchAIStyles: flow(function* () {
      const response = yield self.fetchAIStylesRequest.send(
        api.skyboxRepository.fetchAIStyles,
        null
      );
      self.AIStyles = cast(response || []);
    }),
    generateAISkybox: flow(function* (
      worldId: string,
      prompt: string,
      styleId: number | undefined
    ) {
      self.pendingGenerationErrorMessage = undefined;
      self.pendingGenerationId = undefined;

      const response = yield self.generateAISkyboxRequest.send(
        api.skyboxRepository.generateSkybox,
        {
          prompt,
          skybox_style_id: styleId ?? self.AIStyles[0]?.id ?? -1,
          world_id: worldId
        }
      );

      console.log('AI Skybox:', response);
      if (response?.data?.id) {
        self.pendingGenerationId = String(response.data.id);
        self.pendingGenerationStatus = response.data.status;
      }
      return response;
    })
  }))
  .actions((self) => ({
    updateSkyboxGenerationStatus: flow(function* (statusUpdate: SkyboxGenerationStatusInterface) {
      console.log('UPDATE Skybox generation status:', statusUpdate);
      self.pendingGenerationStatus = statusUpdate.status;
      if (statusUpdate.status === 'complete') {
        self.generatedSkyboxThumbUrl = statusUpdate.thumb_url;

        const response = yield self.fetchGeneratedSkyboxRequest.send(
          api.skyboxRepository.fetchGeneratedSkybox,
          {skyboxId: statusUpdate.id}
        );
        if (!self.fetchGeneratedSkyboxRequest.isError) {
          console.log('Downloaded image size:', response?.length);
          try {
            const blob = new Blob([response], {type: 'image/jpeg'});
            self.generatedSkyboxPreviewUrl = URL.createObjectURL(blob);
            self.generatedSkyboxFile = new File([blob], 'skybox.png', {type: 'image/jpeg'});
            console.log('Downloaded image url:', self.generatedSkyboxPreviewUrl);
          } catch (e) {
            console.log('Failed to convert downloaded image:', e);
          }
        } else {
          console.log('Failed to download image:', self.fetchGeneratedSkyboxRequest.error);
          self.pendingGenerationErrorMessage = 'Error downloading image';
        }
      }
    })
  }));

export {SkyboxSelectorStore};
