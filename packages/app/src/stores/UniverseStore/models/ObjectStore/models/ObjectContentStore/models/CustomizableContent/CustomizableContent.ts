import {flow, types} from 'mobx-state-tree';
import {AttributeNameEnum} from '@momentum-xyz/sdk';
import {RequestModel, ResetModel} from '@momentum-xyz/core';
import {IconNameType} from '@momentum-xyz/ui-kit';

import {api, CustomizableObjectInterface} from 'api';

const CustomizableContent = types
  .compose(
    ResetModel,
    types.model('CustomizableContent', {
      pluginId: '',
      objectId: '',
      isEditing: false,
      content: types.maybe(types.frozen<CustomizableObjectInterface>()),

      fetchRequest: types.optional(RequestModel, {})
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
        alert(1);
        console.log('attributeResponse', attributeResponse);
      }
    })
  }))
  .actions((self) => ({
    setIsEditing(isEditing: boolean): void {
      self.isEditing = isEditing;
    },
    claimAndCustomize: flow(function* () {
      // TODO
    }),
    unclaimAndClear: flow(function* () {
      // TODO
    })
  }))
  .views((self) => ({
    get wasClaimed(): boolean {
      return !!self.content;
    }
  }))
  .views((self) => ({
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
