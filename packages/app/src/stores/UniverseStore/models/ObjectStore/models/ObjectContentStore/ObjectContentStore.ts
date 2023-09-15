import {types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {AssetTypeEnum} from 'core/enums';
import {Asset2dResponse, ObjectMetadataInterface, ObjectOptionsInterface} from 'api';

import {NormalContent, CustomizableContent, CanvasChildContent, CanvasContent} from './models';

const ObjectContentStore = types
  .compose(
    ResetModel,
    types.model('ObjectContentStore', {
      assetType: types.maybe(types.string),
      pluginId: types.maybe(types.string),

      normalContent: types.optional(NormalContent, {}),
      customizableContent: types.optional(CustomizableContent, {}),
      canvasChildContent: types.optional(CanvasChildContent, {}),
      canvasContent: types.optional(CanvasContent, {})
    })
  )
  .actions((self) => ({
    initNormalContent(objectId: string): void {
      self.normalContent = NormalContent.create({});
      self.normalContent.initContent(objectId);
    },
    initCustomizableContent(pluginId: string, objectId: string): void {
      self.customizableContent = CustomizableContent.create({});
      self.customizableContent.initContent(pluginId, objectId);
    },
    initCanvasChildContent(pluginId: string, objectId: string, ownerId: string): void {
      self.canvasChildContent = CanvasChildContent.create({});
      self.canvasChildContent.initContent(pluginId, objectId, ownerId);
    },
    initCanvasContent(pluginId: string, objectId: string): void {
      self.canvasContent = CanvasContent.create({});
      self.canvasContent.initContent(pluginId, objectId);
    }
  }))
  .actions((self) => ({
    setObject(
      object: Asset2dResponse<ObjectMetadataInterface, ObjectOptionsInterface> | undefined,
      objectId: string,
      ownerId: string
    ) {
      console.log('AssetStore setObject', object, objectId);

      if (!object) {
        return;
      }

      const {meta} = object;
      self.pluginId = meta.pluginId;

      switch (meta.name) {
        case AssetTypeEnum.CONTENT:
          self.assetType = AssetTypeEnum.CONTENT;
          self.initNormalContent(objectId);
          break;
        case AssetTypeEnum.CLAIMABLE:
          self.assetType = AssetTypeEnum.CLAIMABLE;
          self.initCustomizableContent(meta.pluginId, objectId);
          break;
        case AssetTypeEnum.CANVAS_ROOT:
          self.assetType = AssetTypeEnum.CANVAS_ROOT;
          self.initCanvasContent(meta.pluginId, objectId);
          break;
        case AssetTypeEnum.CANVAS_CHILD:
          self.assetType = AssetTypeEnum.CANVAS_CHILD;
          self.initCanvasChildContent(meta.pluginId, objectId, ownerId);
          break;
        default:
          break;
      }
    }
  }));

export {ObjectContentStore};
