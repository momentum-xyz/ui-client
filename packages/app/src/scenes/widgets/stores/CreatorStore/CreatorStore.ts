import {flow, types} from 'mobx-state-tree';
import {Dialog, RequestModel, ResetModel} from '@momentum-xyz/core';
import {AttributeNameEnum} from '@momentum-xyz/sdk';

import {GetSpaceInfoResponse, api} from 'api';
import {PluginIdEnum} from 'api/enums';
import {CreatorTabsEnum, WidgetEnum} from 'core/enums';
import {getRootStore} from 'core/utils';

import {
  SkyboxSelectorStore,
  SpawnAssetStore,
  SpawnPointStore,
  ObjectFunctionalityStore,
  ObjectColorStore
} from './models';

type CreatorTabsType = keyof typeof CreatorTabsEnum;

const subMenuKeyWidgetEnumMap: {[key: string]: WidgetEnum} = {
  gizmo: WidgetEnum.MOVE_ITEM,
  inspector: WidgetEnum.INSPECTOR,
  functionality: WidgetEnum.ASSIGN_FUNCTIONALITY
};

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
      const currentTabIsOnSubMenu = self.selectedTab && subMenuKeyWidgetEnumMap[self.selectedTab];
      const correspondingSubMenuWidget = tab && subMenuKeyWidgetEnumMap[tab];

      const {widgetManagerStore} = getRootStore(self);
      if (correspondingSubMenuWidget) {
        widgetManagerStore.setSubMenuActiveKeys([correspondingSubMenuWidget]);
      } else if (currentTabIsOnSubMenu) {
        widgetManagerStore.setSubMenuActiveKeys([]);
      }

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
    })
  }));

export {CreatorStore};
