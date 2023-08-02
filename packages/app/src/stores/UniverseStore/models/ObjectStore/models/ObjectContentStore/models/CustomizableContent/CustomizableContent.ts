import {cast, flow, types} from 'mobx-state-tree';
import {v4 as uuidv4} from 'uuid';
import {AttributeNameEnum} from '@momentum-xyz/sdk';
import {RequestModel, ResetModel, i18n} from '@momentum-xyz/core';
import {IconNameType} from '@momentum-xyz/ui-kit';
import {EffectsEnum} from '@momentum-xyz/core3d';

import {PluginIdEnum} from 'api/enums';
import {LeonardoModelIdEnum} from 'core/enums';
import {MediaUploader, User} from 'core/models';
import {mapper} from 'api/mapper';
import {CustomizableObjectFormInterface, ObjectCommentInterface} from 'core/interfaces';
import {
  api,
  GenerateAIImagesResponse,
  CustomizableObjectInterface,
  FetchAIGeneratedImagesResponse,
  GetSpaceUserAttributeCountResponse
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

      author: types.maybe(User),
      content: types.maybe(types.frozen<CustomizableObjectInterface>()),

      voteCount: 0,
      hasVote: false,

      commentList: types.optional(types.array(types.frozen<ObjectCommentInterface>()), []),

      mediaUploader: types.optional(MediaUploader, {}),
      fetchRequest: types.optional(RequestModel, {}),
      authorRequest: types.optional(RequestModel, {}),
      customizeRequest: types.optional(RequestModel, {}),
      setEffectAttrRequest: types.optional(RequestModel, {}),
      generateRequest: types.optional(RequestModel, {}),
      fetchGeneratedRequest: types.optional(RequestModel, {}),
      cleanRequest: types.optional(RequestModel, {}),
      voteRequest: types.optional(RequestModel, {}),
      voteCountRequest: types.optional(RequestModel, {}),
      commentRequest: types.optional(RequestModel, {}),
      commentListRequest: types.optional(RequestModel, {})
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
  .actions((self) => ({
    fetchVoteCount: flow(function* () {
      const response: GetSpaceUserAttributeCountResponse = yield self.voteCountRequest.send(
        api.spaceUserAttributeRepository.getSpaceUserAttributeCount,
        {
          spaceId: self.objectId,
          pluginId: PluginIdEnum.CORE,
          attributeName: AttributeNameEnum.VOTE
        }
      );

      self.voteCount = response ? response.count : 0;
    }),
    checkVote: flow(function* (userId: string) {
      const response = yield self.voteRequest.send(
        api.spaceUserAttributeRepository.getSpaceUserAttribute,
        {
          userId: userId,
          spaceId: self.objectId,
          pluginId: PluginIdEnum.CORE,
          attributeName: AttributeNameEnum.VOTE
        }
      );

      self.hasVote = !!response;
    }),
    async toggleVote(userId: string) {
      if (self.hasVote) {
        await this.removeVote(userId);
      } else {
        await this.addVote(userId);
      }

      this.fetchVoteCount();
    },
    addVote: flow(function* (userId: string) {
      yield self.voteRequest.send(api.spaceUserAttributeRepository.setSpaceUserAttribute, {
        userId: userId,
        spaceId: self.objectId,
        pluginId: PluginIdEnum.CORE,
        attributeName: AttributeNameEnum.VOTE,
        value: {}
      });

      if (self.voteRequest.isDone) {
        self.hasVote = true;
      }
    }),
    removeVote: flow(function* (userId: string) {
      yield self.voteRequest.send(api.spaceUserAttributeRepository.deleteSpaceUserAttribute, {
        userId: userId,
        spaceId: self.objectId,
        pluginId: PluginIdEnum.CORE,
        attributeName: AttributeNameEnum.VOTE
      });

      if (self.voteRequest.isDone) {
        self.hasVote = false;
      }
    })
  }))
  .actions((self) => ({
    fetchAllComments: flow(function* (userId: string) {
      // TODO: New EP
      const response: Record<string, ObjectCommentInterface> = yield self.commentListRequest.send(
        api.spaceUserAttributeRepository.getSpaceUserAttribute,
        {
          userId: userId,
          spaceId: self.objectId,
          pluginId: PluginIdEnum.CORE,
          attributeName: AttributeNameEnum.COMMENTS
        }
      );

      if (response) {
        self.commentList = cast(mapper.mapSpaceAttributeValues<ObjectCommentInterface>(response));
      } else {
        self.commentList = cast([]);
      }
    }),
    fetchMyComments: flow(function* (userId: string) {
      const response = yield self.commentRequest.send(
        api.spaceUserAttributeRepository.getSpaceUserAttribute,
        {
          userId: userId,
          spaceId: self.objectId,
          pluginId: PluginIdEnum.CORE,
          attributeName: AttributeNameEnum.COMMENTS
        }
      );

      return response || null;
    })
  }))
  .actions((self) => ({
    addComment: flow(function* (userId: string, comment: string) {
      const prevComments = yield self.fetchMyComments(userId);

      const uuid: string = uuidv4();

      const value: Record<string, ObjectCommentInterface> = {
        ...prevComments,
        [uuid]: {id: uuid, date: new Date().toISOString(), comment}
      };

      yield self.commentRequest.send(api.spaceUserAttributeRepository.setSpaceUserAttribute, {
        userId: userId,
        spaceId: self.objectId,
        pluginId: PluginIdEnum.CORE,
        attributeName: AttributeNameEnum.COMMENTS,
        value
      });

      return self.commentRequest.isDone;
    }),
    deleteComment: flow(function* (userId: string, commentId: string) {
      const commentsObj: Record<string, ObjectCommentInterface> = yield self.fetchMyComments(
        userId
      );

      if (!commentsObj) {
        return;
      }

      const commentsMap = new Map(Object.entries(commentsObj));
      commentsMap.delete(commentId);

      if (commentsMap.size === 0) {
        yield self.commentRequest.send(api.spaceUserAttributeRepository.deleteSpaceUserAttribute, {
          userId: userId,
          spaceId: self.objectId,
          pluginId: PluginIdEnum.CORE,
          attributeName: AttributeNameEnum.COMMENTS
        });
      } else {
        yield self.commentRequest.send(api.spaceUserAttributeRepository.setSpaceUserAttribute, {
          userId: userId,
          spaceId: self.objectId,
          pluginId: PluginIdEnum.CORE,
          attributeName: AttributeNameEnum.COMMENTS,
          value: Object.fromEntries(commentsMap)
        });
      }
    })
  }))
  .actions((self) => ({
    initSocial(userId: string) {
      self.fetchVoteCount();
      self.checkVote(userId);
      self.fetchAllComments(userId);
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
      return !self.isEditing && self.wasClaimed
        ? i18n.t('titles.objectInfo')
        : i18n.t('titles.customizeObject');
    },
    get widgetIcon(): IconNameType {
      return !self.isEditing && self.wasClaimed ? 'cubicle' : 'settings-slider';
    }
  }));

export {CustomizableContent};
