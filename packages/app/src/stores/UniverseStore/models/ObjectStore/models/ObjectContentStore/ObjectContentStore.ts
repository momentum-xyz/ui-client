import {types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {AssetTypeEnum} from 'core/enums';
import {Asset2dResponse, ObjectMetadataInterface, ObjectOptionsInterface} from 'api';

import {NormalContent, CustomizableContent, CanvasChildContent} from './models';

const ObjectContentStore = types
  .compose(
    ResetModel,
    types.model('ObjectContentStore', {
      assetType: types.maybe(types.string),
      pluginId: types.maybe(types.string),

      normalContent: types.optional(NormalContent, {}),
      customizableContent: types.optional(CustomizableContent, {}),
      canvasChildContent: types.optional(CanvasChildContent, {})
    })
  )
  .actions((self) => ({
    initNormalContent(spaceId: string): void {
      self.normalContent = NormalContent.create({});
      self.normalContent.initContent(spaceId);
    },
    initCustomizableContent(pluginId: string, spaceId: string): void {
      self.customizableContent = CustomizableContent.create({});
      self.customizableContent.initContent(pluginId, spaceId);
    },
    initCanvasChildContent(pluginId: string, spaceId: string, ownerId: string): void {
      self.canvasChildContent = CanvasChildContent.create({});
      self.canvasChildContent.initContent(pluginId, spaceId, ownerId);
    }
  }))
  .actions((self) => ({
    setObject(
      object: Asset2dResponse<ObjectMetadataInterface, ObjectOptionsInterface> | undefined,
      spaceId: string,
      ownerId: string
    ) {
      console.log('AssetStore setObject', object, spaceId);

      if (!object) {
        return;
      }

      const {meta} = object;
      self.pluginId = meta.pluginId;

      switch (meta.name) {
        case AssetTypeEnum.CONTENT:
          self.assetType = AssetTypeEnum.CONTENT;
          self.initNormalContent(spaceId);
          break;
        case AssetTypeEnum.CLAIMABLE:
          self.assetType = AssetTypeEnum.CLAIMABLE;
          self.initCustomizableContent(meta.pluginId, spaceId);
          break;
        case AssetTypeEnum.CANVAS_ROOT:
          self.assetType = AssetTypeEnum.CANVAS_ROOT;
          //self.initCustomizableContent(meta.pluginId, spaceId);
          break;
        case AssetTypeEnum.CANVAS_CHILD:
          self.assetType = AssetTypeEnum.CANVAS_CHILD;
          self.initCanvasChildContent(meta.pluginId, spaceId, ownerId);
          break;
        default:
          break;
      }
    }
  }));

export {ObjectContentStore};
