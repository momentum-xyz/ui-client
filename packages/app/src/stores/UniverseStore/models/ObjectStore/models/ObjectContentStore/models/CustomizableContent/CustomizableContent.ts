import {flow, types} from 'mobx-state-tree';
import {AttributeNameEnum} from '@momentum-xyz/sdk';
import {RequestModel, ResetModel} from '@momentum-xyz/core';
import {IconNameType} from '@momentum-xyz/ui-kit';

import {MediaUploader} from 'core/models';
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

      mediaUploader: types.optional(MediaUploader, {}),
      fetchRequest: types.optional(RequestModel, {}),
      customizeRequest: types.optional(RequestModel, {}),
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

      return self.customizeRequest.isDone;
    }),
    unclaimAndClear: flow(function* () {
      yield self.cleanRequest.send(api.spaceRepository.cleanCustomization, {
        objectId: self.objectId
      });

      if (self.cleanRequest.isDone) {
        self.content = undefined;
      }

      return self.cleanRequest.isDone;
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
      return self.fetchRequest.isNotComplete;
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
