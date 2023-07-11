import {cast, flow, types} from 'mobx-state-tree';
import {AttributeNameEnum} from '@momentum-xyz/sdk';
import {RequestModel, ResetModel} from '@momentum-xyz/core';
import {IconNameType} from '@momentum-xyz/ui-kit';
import {EffectsEnum} from '@momentum-xyz/core3d';

import {MediaUploader, User} from 'core/models';
import {api, CustomizableObjectInterface} from 'api';
import {CustomizableObjectFormInterface} from 'core/interfaces';

const CustomizableContent = types
  .compose(
    ResetModel,
    types.model('CustomizableContent', {
      pluginId: '',
      objectId: '',
      isEditing: false,

      content: types.maybe(types.frozen<CustomizableObjectInterface>()),
      author: types.maybe(User),

      mediaUploader: types.optional(MediaUploader, {}),
      fetchRequest: types.optional(RequestModel, {}),
      authorRequest: types.optional(RequestModel, {}),
      customizeRequest: types.optional(RequestModel, {}),
      setEffectAttrRequest: types.optional(RequestModel, {}),
      cleanRequest: types.optional(RequestModel, {})
    })
  )
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
      const render_hash = yield self.mediaUploader.uploadImageOrVideo(form.image);
      if (!render_hash) {
        return false;
      }

      yield self.customizeRequest.send(api.spaceRepository.claimAndCustomize, {
        objectId: self.objectId,
        text: form.text || '',
        title: form.title || '',
        image_hash: render_hash
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
      yield self.cleanRequest.send(api.spaceRepository.cleanCustomization, {
        objectId: self.objectId
      });

      if (self.cleanRequest.isDone) {
        self.content = undefined;
        self.author = undefined;
      }

      if (self.cleanRequest.isError) {
        return false;
      }

      yield self.setEffectAttrRequest.send(api.spaceAttributeRepository.setSpaceAttribute, {
        spaceId: self.objectId,
        plugin_id: self.pluginId,
        attribute_name: AttributeNameEnum.OBJECT_EFFECT,
        value: {value: EffectsEnum.TRANSPARENT}
      });

      return self.setEffectAttrRequest.isDone;
    })
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
