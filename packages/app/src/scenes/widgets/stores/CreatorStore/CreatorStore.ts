import {flow, types} from 'mobx-state-tree';
import {Dialog, RequestModel, ResetModel} from '@momentum-xyz/core';
import {AttributeNameEnum} from '@momentum-xyz/sdk';

import {GetSpaceInfoResponse, CreateObjectResponse, api} from 'api';
import {PluginIdEnum} from 'api/enums';
import {CreatorTabsEnum} from 'core/enums';
import {getRootStore} from 'core/utils';
import {PosBusService} from 'shared/services';

import {
  WorldEditorStore,
  SkyboxSelectorStore,
  SpawnAssetStore,
  SpawnPointStore,
  ObjectFunctionalityStore,
  ObjectColorStore,
  MusicManagerStore,
  CanvasEditorStore
} from './models';

type CreatorTabsType = keyof typeof CreatorTabsEnum;

const CreatorStore = types
  .compose(
    ResetModel,
    types.model('CreatorStore', {
      worldEditorStore: types.optional(WorldEditorStore, {}),
      canvasEditorStore: types.optional(CanvasEditorStore, {}),
      skyboxSelectorStore: types.optional(SkyboxSelectorStore, {}),
      spawnAssetStore: types.optional(SpawnAssetStore, {}),
      musicManagerStore: types.optional(MusicManagerStore, {}),
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
      saveObjectNameRequest: types.optional(RequestModel, {}),
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
    fetchObjectName: flow(function* (objectId: string) {
      const attributeName = AttributeNameEnum.NAME;
      const response = yield self.getObjectNameRequest.send(
        api.objectAttributeRepository.getObjectAttribute,
        {
          objectId: objectId,
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
      self.objectName = null;
      self.objectInfo = null;

      self.selectedObjectId = id;

      if (id) {
        Promise.all([self.fetchObject(id), self.fetchObjectName(id)]);
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

      yield self.removeObjectRequest.send(api.objectRepository.deleteObject, {
        objectId: self.selectedObjectId
      });

      // TODO merge these stores??
      getRootStore(self).universeStore.world3dStore?.closeAndResetObjectMenu();
    }),
    duplicateObject: flow(function* (objectId: string) {
      PosBusService.attachNextReceivedObjectToCamera = true;

      const response: CreateObjectResponse | undefined = yield self.duplicateObjectRequest.send(
        api.objectRepository.cloneObject,
        {
          objectId
        }
      );
      const clonedObjectId = response?.object_id;

      if (clonedObjectId) {
        getRootStore(self).universeStore.world3dStore?.setAttachedToCamera(clonedObjectId);
      }

      return clonedObjectId;
    }),
    saveObjectName: flow(function* (name: string) {
      if (!self.selectedObjectId) {
        return;
      }

      yield self.saveObjectNameRequest.send(api.objectAttributeRepository.setObjectAttributeItem, {
        objectId: self.selectedObjectId,
        plugin_id: PluginIdEnum.CORE,
        attribute_name: AttributeNameEnum.NAME,
        sub_attribute_key: AttributeNameEnum.NAME,
        value: name
      });

      if (!self.saveObjectNameRequest.isError) {
        self.objectName = name;
      }
    })
  }));

export {CreatorStore};
