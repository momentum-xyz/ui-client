import {flow, types} from 'mobx-state-tree';
import {Dialog, RequestModel, ResetModel} from '@momentum-xyz/core';
import {AttributeNameEnum} from '@momentum-xyz/sdk';

import {GetSpaceInfoResponse, PostSpaceResponse, api} from 'api';
import {PluginIdEnum} from 'api/enums';
import {CreatorTabsEnum} from 'core/enums';
import {getRootStore} from 'core/utils';
import {PosBusService} from 'shared/services';

import {
  SkyboxSelectorStore,
  SpawnAssetStore,
  SpawnPointStore,
  ObjectFunctionalityStore,
  ObjectColorStore
} from './models';

type CreatorTabsType = keyof typeof CreatorTabsEnum;

const CreatorStore = types
  .compose(
    ResetModel,
    types.model('CreatorStore', {
      skyboxSelectorStore: types.optional(SkyboxSelectorStore, {}),
      spawnAssetStore: types.optional(SpawnAssetStore, {}),
      spawnPointStore: types.optional(SpawnPointStore, {}),
      objectFunctionalityStore: types.optional(ObjectFunctionalityStore, {}),
      objectColorStore: types.optional(ObjectColorStore, {}),

      selectedTab: types.maybeNull(types.enumeration(Object.keys(CreatorTabsEnum))),
      selectedObjectId: types.maybeNull(types.string),
      objectName: types.maybeNull(types.string),
      objectInfo: types.maybeNull(types.frozen<GetSpaceInfoResponse>()),
      getObjectInfoRequest: types.optional(RequestModel, {}),
      getObjectNameRequest: types.optional(RequestModel, {}),

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
      assetId: string,
      name: string,
      transform: any
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
        getRootStore(self).universeStore.world3dStore?.setAttachedToCamera(objectId);
      }

      return objectId;
    })
  }));

export {CreatorStore};
