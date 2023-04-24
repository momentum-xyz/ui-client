import {flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';
import {AttributeNameEnum} from '@momentum-xyz/sdk';

import {GetSpaceInfoResponse, api} from 'api';
import {PluginIdEnum} from 'api/enums';
import {CreatorTabsEnum} from 'core/enums';

import {SkyboxSelectorStore} from './SkyboxSelectorStore';
import {SpawnAssetStore} from './SpawnAssetStore';
import {SpawnPointStore} from './SpawnPointStore';
import {ObjectFunctionalityStore} from './ObjectFunctionalityStore';
import {ObjectColorStore} from './ObjectColorStore';

type CreatorTabsType = keyof typeof CreatorTabsEnum;

const RootOdysseyCreatorStore = types
  .compose(
    ResetModel,
    types.model('RootOdysseyCreatorStore', {
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
      getObjectNameRequest: types.optional(RequestModel, {})
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
  }));

export {RootOdysseyCreatorStore};
