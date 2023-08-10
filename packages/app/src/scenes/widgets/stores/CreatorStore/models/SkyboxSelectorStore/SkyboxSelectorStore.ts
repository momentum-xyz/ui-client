import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';
import {AttributeNameEnum, AttributeValueInterface} from '@momentum-xyz/sdk';

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

const GROUP_SIZE = 3;
const PAGE_GROUP_COUNT = 2;

const SkyboxSelectorStore = types
  .compose(
    ResetModel,
    types.model('SkyboxSelectorStore', {
      request: types.optional(RequestModel, {}),
      worldSettingsRequest: types.optional(RequestModel, {}),
      createSkyboxRequest: types.optional(RequestModel, {}),
      removeSkyboxRequest: types.optional(RequestModel, {}),

      userSkyboxes: types.optional(types.array(SkyboxItem), []),
      fetchUserSkyboxesRequest: types.optional(RequestModel, {}),

      communitySkyboxes: types.optional(types.array(SkyboxItem), []),
      communitySkyboxesCount: types.optional(types.number, 0),
      communitySkyboxesGroupsCount: types.optional(types.number, 0),
      fetchCommunitySkyboxesRequest: types.optional(RequestModel, {}),

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
  .actions((self) => ({
    async fetchItems(worldId: string, userId: string) {
      await this.loadMoreCommunitySkyboxes(0);
      await this.fetchUserSkyboxes(userId);
    },
    loadMoreCommunitySkyboxes: flow(function* (startIndex: number) {
      if (startIndex === 0) {
        self.communitySkyboxes = cast([]);
        self.communitySkyboxesCount = 0;
        self.communitySkyboxesGroupsCount = 0;
      }

      const response: GetAllSpaceUserAttributeListResponse =
        yield self.fetchCommunitySkyboxesRequest.send(
          api.spaceUserAttributeRepository.getAllSpaceUserAttributeList,
          {
            spaceId: appVariables.NODE_ID,
            pluginId: PluginIdEnum.CORE,
            attributeName: AttributeNameEnum.SKYBOX_LIST,
            // Fields of SkyboxItemModelType
            fields: ['name', 'is_public', 'artist_name'],
            filterField: 'is_public',
            filterValue: 'true',
            limit: GROUP_SIZE * PAGE_GROUP_COUNT,
            offset: GROUP_SIZE * startIndex
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

        self.communitySkyboxes = cast([...self.communitySkyboxes, ...skyboxes]);

        const totalCount = response.count;
        const loadedCount = self.communitySkyboxes.length;
        const noMoreItems = loadedCount >= totalCount;
        const totalGroupCount = Math.ceil(totalCount / GROUP_SIZE);
        const loadedGroupCount = Math.ceil(loadedCount / GROUP_SIZE);

        self.communitySkyboxesCount = response.count;
        self.communitySkyboxesGroupsCount = noMoreItems ? totalGroupCount : loadedGroupCount + 1;
      }
    }),
    fetchUserSkyboxes: flow(function* (userId: string) {
      const response: AttributeValueInterface = yield self.fetchUserSkyboxesRequest.send(
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
    updateActiveSkybox: flow(function* (id: string, worldId: string) {
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
      yield self.loadMoreCommunitySkyboxes(0);

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
  }))
  .actions((self) => ({
    castSkyboxesToGroups(skyboxes: SkyboxItemModelType[]): SkyboxItemModelType[][] {
      const groups = [];
      while (skyboxes.length) {
        groups.push(skyboxes.splice(0, GROUP_SIZE));
      }
      return groups;
    }
  }))
  .views((self) => ({
    get isUploadPending(): boolean {
      return self.createSkyboxRequest.isPending;
    },
    get isSkyboxesLoading(): boolean {
      return (
        self.fetchCommunitySkyboxesRequest.isNotComplete ||
        self.fetchUserSkyboxesRequest.isNotComplete
      );
    },
    get allSkyboxes(): SkyboxItemModelType[] {
      return [...self.communitySkyboxes, ...self.userSkyboxes];
    },
    get communitySkyboxGroups(): SkyboxItemModelType[][] {
      return self.castSkyboxesToGroups([...self.communitySkyboxes]);
    },
    get userSkyboxGroups(): SkyboxItemModelType[][] {
      return self.castSkyboxesToGroups([...self.userSkyboxes]);
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
  }));

export {SkyboxSelectorStore};
