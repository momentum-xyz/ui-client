import {cast, flow, types} from 'mobx-state-tree';
import {AttributeNameEnum} from '@momentum-xyz/sdk';
import {RequestModel, ResetModel} from '@momentum-xyz/core';
import {IconNameType} from '@momentum-xyz/ui-kit';
import {EffectsEnum} from '@momentum-xyz/core3d';

import {LeonardoModelIdEnum} from 'core/enums';
import {MediaUploader, User} from 'core/models';
import {CustomizableObjectFormInterface} from 'core/interfaces';
import {
  api,
  CustomizableObjectInterface,
  FetchAIGeneratedImagesResponse,
  GenerateAIImagesResponse
} from 'api';

const CustomizableContent = types
  .compose(
    ResetModel,
    types.model('CustomizableContent', {
      pluginId: '',
      objectId: '',
      isEditing: false,

      isGenerating: false,
      generationJobId: types.maybeNull(types.string),
      generatedImages: types.optional(types.array(types.string), []),

      content: types.maybe(types.frozen<CustomizableObjectInterface>()),
      author: types.maybe(User),

      mediaUploader: types.optional(MediaUploader, {}),
      fetchRequest: types.optional(RequestModel, {}),
      authorRequest: types.optional(RequestModel, {}),
      customizeRequest: types.optional(RequestModel, {}),
      setEffectAttrRequest: types.optional(RequestModel, {}),
      generateRequest: types.optional(RequestModel, {}),
      fetchGeneratedRequest: types.optional(RequestModel, {}),
      cleanRequest: types.optional(RequestModel, {})
    })
  )
  .volatile<{watcher: NodeJS.Timer | null}>(() => ({
    watcher: null
  }))
  .actions((self) => ({
    initContent: flow(function* (pluginId: string, objectId: string) {
      self.pluginId = pluginId;
      self.objectId = objectId;

      const attributeResponse = yield self.fetchRequest.send(
        api.spaceAttributeRepository.getSpaceAttribute,
        {
          spaceId: self.objectId,
          plugin_id: self.pluginId, // It is PluginIdEnum.CORE
          attribute_name: AttributeNameEnum.USER_CUSTOMISABLE_DATA
        }
      );

      if (attributeResponse) {
        self.content = attributeResponse;
      }

      if (attributeResponse?.claimed_by) {
        const authorResponse = yield self.authorRequest.send(api.userRepository.fetchUser, {
          userId: attributeResponse.claimed_by
        });

        if (authorResponse) {
          self.author = cast(authorResponse);
        }
      }
    }),
    fetchContent(): void {
      this.initContent(self.pluginId, self.objectId);
    }
  }))
  .actions((self) => ({
    setIsEditing(isEditing: boolean): void {
      self.isEditing = isEditing;
    },
    claimAndCustomize: flow(function* (form: CustomizableObjectFormInterface) {
      const imageHashOrUrl = form.imageAIUrl
        ? yield self.mediaUploader.uploadImageByUrl(form.imageAIUrl)
        : yield self.mediaUploader.uploadImageOrVideo(form.image);

      if (!imageHashOrUrl && !self.content?.image_hash) {
        return false;
      }

      yield self.customizeRequest.send(api.spaceRepository.claimAndCustomize, {
        objectId: self.objectId,
        text: form.text || '',
        title: form.title || '',
        image_hash: imageHashOrUrl || self.content?.image_hash || ''
      });

      if (!self.customizeRequest.isDone) {
        return false;
      }

      yield self.setEffectAttrRequest.send(api.spaceAttributeRepository.setSpaceAttribute, {
        spaceId: self.objectId,
        plugin_id: self.pluginId,
        attribute_name: AttributeNameEnum.OBJECT_EFFECT,
        value: {value: EffectsEnum.NONE}
      });

      return self.setEffectAttrRequest.isDone;
    }),
    unclaimAndClear: flow(function* () {
      yield self.setEffectAttrRequest.send(api.spaceAttributeRepository.setSpaceAttribute, {
        spaceId: self.objectId,
        plugin_id: self.pluginId,
        attribute_name: AttributeNameEnum.OBJECT_EFFECT,
        value: {value: EffectsEnum.TRANSPARENT}
      });

      yield self.cleanRequest.send(api.spaceRepository.cleanCustomization, {
        objectId: self.objectId
      });

      if (self.cleanRequest.isDone) {
        self.content = undefined;
        self.author = undefined;
      }

      return self.cleanRequest.isError;
    })
  }))
  .actions((self) => ({
    startFetchingImages(): void {
      if (self.watcher) {
        clearInterval(self.watcher);
      }
      self.watcher = setInterval(() => {
        this.fetchGeneratedAIImages();
      }, 1000);
    },
    fetchGeneratedAIImages: flow(function* () {
      const response: FetchAIGeneratedImagesResponse = yield self.fetchGeneratedRequest.send(
        api.aiImagesRepository.fetchImages,
        {
          leonardoId: self.generationJobId || ''
        }
      );

      if (response) {
        const {generated_images} = response.data.generations_by_pk;
        if (generated_images.length > 0) {
          clearInterval(self.watcher || undefined);
          self.generatedImages = cast(generated_images.map((i) => i.url));
          self.isGenerating = false;
        }
      }
    })
  }))
  .actions((self) => ({
    generateAIImages: flow(function* (prompt: string, modelId: LeonardoModelIdEnum) {
      self.isGenerating = true;

      const response: GenerateAIImagesResponse = yield self.generateRequest.send(
        api.aiImagesRepository.generateImages,
        {
          prompt: prompt,
          model: modelId
        }
      );

      if (response?.data.sdGenerationJob) {
        self.generationJobId = response.data.sdGenerationJob.generationId;
        self.startFetchingImages();
      } else {
        self.isGenerating = false;
      }
    }),
    clearGeneratedImages(): void {
      self.generatedImages = cast([]);
    }
  }))
  .views((self) => ({
    get wasClaimed(): boolean {
      return !!self.content;
    }
  }))
  .views((self) => ({
    get isPending(): boolean {
      return self.mediaUploader.isPending || self.customizeRequest.isPending;
    },
    get isLoading(): boolean {
      return self.fetchRequest.isPending || self.authorRequest.isPending;
    },
    get isNewOrEditForm(): boolean {
      return !self.content || (!!self.content && self.isEditing);
    },
    get isViewForm(): boolean {
      return !self.isEditing && !!self.content;
    }
  }))
  .views((self) => ({
    get widgetTitle(): string {
      return !self.isEditing && self.wasClaimed ? 'Contribution' : 'Customize object';
    },
    get widgetIcon(): IconNameType {
      return !self.isEditing && self.wasClaimed ? 'alert' : 'settings-slider';
    }
  }));

export {CustomizableContent};
