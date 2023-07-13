import {types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {AssetTypeEnum} from 'core/enums';
import {Asset2dResponse, ObjectMetadataInterface, ObjectOptionsInterface} from 'api';

import {NormalContent, CustomizableContent} from './models';

const ObjectContentStore = types
  .compose(
    ResetModel,
    types.model('ObjectContentStore', {
      assetType: types.maybe(types.string),
      pluginId: types.maybe(types.string),

      normalContent: types.optional(NormalContent, {}),
      customizableContent: types.optional(CustomizableContent, {})
    })
  )
  .actions((self) => ({
    initNormalContent(pluginId: string, spaceId: string): void {
      self.normalContent = NormalContent.create({});
      self.normalContent.initContent(pluginId, spaceId);
    },
    initCustomizableContent(pluginId: string, spaceId: string): void {
      self.customizableContent = CustomizableContent.create({});
      self.customizableContent.initContent(pluginId, spaceId);
    }
  }))
  .actions((self) => ({
    setObject(
      object: Asset2dResponse<ObjectMetadataInterface, ObjectOptionsInterface> | undefined,
      spaceId: string
    ) {
      console.log('AssetStore setObject', object, spaceId);

      if (!object) {
        return;
      }

      const {meta} = object;
      self.pluginId = meta.pluginId;

      switch (meta.name) {
        case AssetTypeEnum.TEXT:
          self.assetType = AssetTypeEnum.TEXT;
          self.initNormalContent(meta.pluginId, spaceId);
          break;
        case AssetTypeEnum.IMAGE:
          self.assetType = AssetTypeEnum.IMAGE;
          self.initNormalContent(meta.pluginId, spaceId);
          break;
        case AssetTypeEnum.CLAIMABLE:
          self.assetType = AssetTypeEnum.CLAIMABLE;
          self.initCustomizableContent(meta.pluginId, spaceId);
          break;
        /*case AssetTypeEnum.DOCK:
          self.assetType = AssetTypeEnum.DOCK;
          self.getDockInfo(spaceId);
          break;*/
        default:
          break;
      }
    }
  }));

export {ObjectContentStore};
