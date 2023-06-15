import {RequestModel, ResetModel} from '@momentum-xyz/core';
import {AttributeNameEnum} from '@momentum-xyz/sdk';
import {flow, types} from 'mobx-state-tree';

import {api, GetSpaceInfoResponse} from 'api';
import {PluginIdEnum} from 'api/enums';

const PORTAL_ASSET_3D_ID = 'de240de6-d911-4d84-9406-8b81550dfea8';

const ObjectFunctionalityStore = types
  .compose(
    ResetModel,
    types.model('ObjectFunctionalityStore', {
      objectId: types.maybe(types.string),
      objectName: types.maybe(types.string),
      objectInfo: types.maybe(types.frozen<GetSpaceInfoResponse>()),
      getObjectInfoRequest: types.optional(RequestModel, {}),
      updateAsset2dRequest: types.optional(RequestModel, {}),

      getAttributeItemRequest: types.optional(RequestModel, {}),
      currentAssetId: types.maybe(types.string),
      isObjectPortal: types.optional(types.boolean, false)
    })
  )
  .actions((self) => ({
    init(objectId: string): void {
      this.fetchObject(objectId);
      this.fetchObjectName(objectId);
    },
    fetchObject: flow(function* (objectId: string) {
      const response = yield self.getObjectInfoRequest.send(api.spaceInfoRepository.getSpaceInfo, {
        spaceId: objectId
      });

      if (response) {
        self.objectId = objectId;
        self.objectInfo = response;
        self.currentAssetId = response.asset_2d_id;
        self.isObjectPortal = response.asset_3d_id === PORTAL_ASSET_3D_ID;
      }
    }),
    updateObject: flow(function* () {
      if (!self.currentAssetId || !self.objectId) {
        return;
      }

      yield self.updateAsset2dRequest.send(api.spaceInfoRepository.patchSpaceInfo, {
        spaceId: self.objectId,
        asset_2d_id: self.currentAssetId
      });
    }),
    removeObjectFunctionality: flow(function* () {
      if (!self.objectId) {
        return;
      }

      yield self.updateAsset2dRequest.send(api.spaceInfoRepository.patchSpaceInfo, {
        spaceId: self.objectId,
        asset_2d_id: ""
      });

      self.currentAssetId = '';
    }),
    selectAsset(id: string) {
      self.currentAssetId = id;
    },
    fetchObjectName: flow(function* (spaceId: string) {
      const attributeName = AttributeNameEnum.NAME;
      const response = yield self.getAttributeItemRequest.send(
        api.spaceAttributeRepository.getSpaceAttribute,
        {
          spaceId: spaceId,
          plugin_id: PluginIdEnum.CORE,
          attribute_name: attributeName,
          sub_attribute_key: attributeName
        }
      );

      if (response === undefined || !(attributeName in response)) {
        return;
      }

      self.objectName = response[attributeName];
    })
  }));

export {ObjectFunctionalityStore};
