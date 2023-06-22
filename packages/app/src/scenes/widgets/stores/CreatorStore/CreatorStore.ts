import {flow, types} from 'mobx-state-tree';
import {Dialog, RequestModel, ResetModel} from '@momentum-xyz/core';
import {AttributeNameEnum} from '@momentum-xyz/sdk';

import {GetSpaceInfoResponse, PostSpaceResponse, api} from 'api';
import {PluginIdEnum} from 'api/enums';
import {CreatorTabsEnum} from 'core/enums';
import {getRootStore} from 'core/utils';
import {PosBusService} from 'shared/services';
import {ObjectColorAttributeInterface} from 'api/interfaces';

import {
  SkyboxSelectorStore,
  SpawnAssetStore,
  SpawnPointStore,
  ObjectFunctionalityStore,
  ObjectColorStore,
  SoundSelectorStore
} from './models';

type CreatorTabsType = keyof typeof CreatorTabsEnum;

const CreatorStore = types
  .compose(
    ResetModel,
    types.model('CreatorStore', {
      skyboxSelectorStore: types.optional(SkyboxSelectorStore, {}),
      spawnAssetStore: types.optional(SpawnAssetStore, {}),
      soundSelectorStore: types.optional(SoundSelectorStore, {}),
      spawnPointStore: types.optional(SpawnPointStore, {}),
      objectFunctionalityStore: types.optional(ObjectFunctionalityStore, {}),
      objectColorStore: types.optional(ObjectColorStore, {}),

      selectedTab: types.maybeNull(types.enumeration(Object.keys(CreatorTabsEnum))),
      selectedObjectId: types.maybeNull(types.string),
      objectName: types.maybeNull(types.string),
      objectInfo: types.maybeNull(types.frozen<GetSpaceInfoResponse>()),
      getObjectInfoRequest: types.optional(RequestModel, {}),
      getObjectNameRequest: types.optional(RequestModel, {}),

      duplicateSourceId: types.maybeNull(types.string),
      duplicateId: types.maybeNull(types.string),

      duplicateObjectRequest: types.optional(RequestModel, {}),
      removeObjectDialog: types.optional(Dialog, {}),
      removeObjectRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    fetchObject: flow(function* (objectId: string) {
      const response = yield self.getObjectInfoRequest.send(api.spaceInfoRepository.getSpaceInfo, {
        spaceId: objectId
      });

      if (response) {
        self.objectInfo = response;
      }
    }),
    fetchObjectName: flow(function* (spaceId: string) {
      const attributeName = AttributeNameEnum.NAME;
      const response = yield self.getObjectNameRequest.send(
        api.spaceAttributeRepository.getSpaceAttribute,
        {
          spaceId: spaceId,
          plugin_id: PluginIdEnum.CORE,
          attribute_name: attributeName
        }
      );

      if (response === undefined || !(attributeName in response)) {
        return;
      }

      self.objectName = response[attributeName];
    })
  }))
  .actions((self) => ({
    setSelectedObjectId(id: string | null) {
      self.selectedObjectId = id;
      if (id) {
        Promise.all([self.fetchObject(id), self.fetchObjectName(id)]);
      } else {
        self.objectName = null;
        self.objectInfo = null;
      }
    },
    setSelectedTab(tab: CreatorTabsType | null) {
      self.selectedTab = tab;
    }
  }))
  .actions((self) => ({
    removeObject: flow(function* () {
      if (!self.selectedObjectId) {
        return;
      }

      yield self.removeObjectRequest.send(api.spaceRepository.deleteSpace, {
        spaceId: self.selectedObjectId
      });

      // TODO merge these stores??
      getRootStore(self).universeStore.world3dStore?.closeAndResetObjectMenu();
    }),
    duplicateObject: flow(function* (
      worldId: string,
      sourceObjectId: string,
      assetId: string,
      name: string
    ) {
      PosBusService.attachNextReceivedObjectToCamera = true;

      const response: PostSpaceResponse | undefined = yield self.duplicateObjectRequest.send(
        api.spaceRepository.postSpace,
        {
          parent_id: worldId,
          object_name: name,
          object_type_id: '4ed3a5bb-53f8-4511-941b-07902982c31c',
          asset_3d_id: assetId,
          minimap: false // self.isVisibleInNavigation
        }
      );
      const objectId = response?.object_id;

      if (objectId) {
        self.duplicateSourceId = sourceObjectId;
        self.duplicateId = objectId;
        getRootStore(self).universeStore.world3dStore?.setAttachedToCamera(objectId);
      }

      return objectId;
    }),
    isDuplicatedObject: (id: string) => self.duplicateId === id,
    updateDuplicatedObject: flow(function* () {
      const duplicateSourceId = self.duplicateSourceId;
      const duplicateId = self.duplicateId;

      if (!duplicateSourceId || !duplicateId) {
        return;
      }

      const sourceObjectInfo = yield self.getObjectInfoRequest.send(
        api.spaceInfoRepository.getSpaceInfo,
        {
          spaceId: duplicateSourceId
        }
      );
      const duplicateObjectInfo = yield self.getObjectInfoRequest.send(
        api.spaceInfoRepository.getSpaceInfo,
        {
          spaceId: duplicateId
        }
      );

      if (!duplicateObjectInfo || !sourceObjectInfo) {
        self.duplicateId = null;
        self.duplicateSourceId = null;
        return;
      }

      // 1. Transform data
      const transform = {
        position: duplicateObjectInfo.transform.position,
        rotation: sourceObjectInfo.transform.rotation,
        scale: sourceObjectInfo.transform.scale
      };
      PosBusService.sendObjectTransform(duplicateId, transform);

      // 2. Color
      const colorResponse: ObjectColorAttributeInterface = yield self.duplicateObjectRequest.send(
        api.spaceAttributeRepository.getSpaceAttribute,
        {
          spaceId: duplicateSourceId,
          plugin_id: PluginIdEnum.CORE,
          attribute_name: AttributeNameEnum.OBJECT_COLOR
        }
      );

      if (colorResponse && colorResponse.value) {
        const colorHex = colorResponse.value;
        setTimeout(() => {
          self.objectColorStore.updateObjectColor(duplicateId, colorHex.replace(/-/g, ''));
        }, 100);
      }
      self.duplicateId = null;
      self.duplicateSourceId = null;
      // 3. Functionality --- skip this
    })
  }));

export {CreatorStore};
