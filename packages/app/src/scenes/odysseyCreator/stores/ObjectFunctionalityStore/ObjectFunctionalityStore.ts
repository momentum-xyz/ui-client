import {RequestModel, ResetModel} from '@momentum-xyz/core';
import {flow, types} from 'mobx-state-tree';

import {api, GetSpaceInfoResponse} from 'api';

const ObjectFunctionalityStore = types
  .compose(
    ResetModel,
    types.model('ObjectFunctionalityStore', {
      objectId: types.maybe(types.string),
      objectInfo: types.maybe(types.frozen<GetSpaceInfoResponse>()),
      getObjectInfoRequest: types.optional(RequestModel, {}),
      updateAsset2dRequest: types.optional(RequestModel, {}),
      removeObjectRequest: types.optional(RequestModel, {}),
      assets2D: types.optional(types.frozen<Record<string, string>>(), {
        '0d99e5aa-a627-4353-8bfa-1c0e7053db90': 'google drive Local',
        '2a879830-b79e-4c35-accc-05607c51d504': 'miro local',
        '7be0964f-df73-4880-91f5-22eef9967999': 'image',
        'bda25d5d-2aab-45b4-9e8a-23579514cec1': 'video',
        'be0d0ca3-c50b-401a-89d9-0e59fc45c5c2': 'text',
        'a31722a6-26b7-46bc-97f9-435c380c3ca9': 'miro',
        'c601404b-61a2-47d5-a5c7-f3c704a8bf58': 'google Drive',
        '140c0f2e-2056-443f-b5a7-4a3c2e6b05da': 'dock (temporary)'
      }),

      currentAssetId: types.maybe(types.string)
    })
  )
  .actions((self) => ({
    fetchObject: flow(function* (objectId: string) {
      self.objectInfo = yield self.getObjectInfoRequest.send(api.spaceInfoRepository.getSpaceInfo, {
        spaceId: objectId
      });

      if (self.objectInfo) {
        self.objectId = objectId;
      }

      self.currentAssetId = self.objectInfo?.asset_2d_id;
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
    selectAsset(id: string) {
      self.currentAssetId = id;
    },
    deleteObject: flow(function* () {
      if (!self.objectId) {
        return;
      }

      yield self.removeObjectRequest.send(api.spaceRepository.deleteSpace, {
        spaceId: self.objectId
      });
    })
  }));

export {ObjectFunctionalityStore};
