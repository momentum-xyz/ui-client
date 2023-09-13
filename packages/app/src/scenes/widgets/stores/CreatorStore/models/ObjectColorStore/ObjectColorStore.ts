import {RequestModel, ResetModel} from '@momentum-xyz/core';
import {AttributeNameEnum} from '@momentum-xyz/sdk';
import {flow, types} from 'mobx-state-tree';

import {BasicAsset2dIdEnum} from 'core/enums';
import {api, FetchAssets3dResponse, GetSpaceInfoResponse} from 'api';
import {Asset3dCategoryEnum, PluginIdEnum} from 'api/enums';
import {ObjectColorAttributeInterface} from 'api/interfaces';

const ObjectColorStore = types
  .compose(
    ResetModel,
    types.model('ObjectColorStore', {
      objectId: types.maybe(types.string),
      objectColor: types.maybe(types.string),
      fetchRequest: types.optional(RequestModel, {}),
      updateRequest: types.optional(RequestModel, {}),
      objectInfoRequest: types.optional(RequestModel, {}),
      assets3dRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    async init(objectId: string): Promise<void> {
      await this.fetchObjectColor(objectId);
    },

    fetchObjectColor: flow(function* (objectId: string) {
      const response: ObjectColorAttributeInterface = yield self.fetchRequest.send(
        api.objectAttributeRepository.getObjectAttribute,
        {
          spaceId: objectId,
          plugin_id: PluginIdEnum.CORE,
          attribute_name: AttributeNameEnum.OBJECT_COLOR
        }
      );

      if (response) {
        self.objectColor = response.value;
      }
    }),
    updateObjectColor: flow(function* (objectId: string, colorHex: string) {
      const value: ObjectColorAttributeInterface = {value: colorHex};

      yield self.updateRequest.send(api.objectAttributeRepository.setSpaceAttribute, {
        spaceId: objectId,
        plugin_id: PluginIdEnum.CORE,
        attribute_name: AttributeNameEnum.OBJECT_COLOR,
        value
      });
    }),
    isColorPickerAvailable: flow(function* (worldId: string, objectId: string) {
      const objectInfo: GetSpaceInfoResponse = yield self.objectInfoRequest.send(
        api.spaceInfoRepository.getSpaceInfo,
        {spaceId: objectId}
      );

      const assets3dList: FetchAssets3dResponse = yield self.assets3dRequest.send(
        api.assets3dRepository.fetchAssets3d,
        {category: Asset3dCategoryEnum.BASIC, worldId}
      );

      if (assets3dList && objectInfo?.asset_3d_id) {
        const asset3dIds = assets3dList.map(({id}) => id);

        const isBaseObject = asset3dIds.includes(objectInfo.asset_3d_id);
        const isNotImage = objectInfo.asset_2d_id !== BasicAsset2dIdEnum.IMAGE;

        return isBaseObject && isNotImage;
      }

      return false;
    })
  }));

export {ObjectColorStore};
