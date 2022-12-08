import {RequestModel, ResetModel} from '@momentum-xyz/core';
import {flow, types} from 'mobx-state-tree';

import {api, GetSpaceInfoResponse} from 'api';

const WorldBuilderObjectStore = types
  .compose(
    ResetModel,
    types.model('WorldBuilderObjectStore', {
      objectInfo: types.maybe(types.frozen<GetSpaceInfoResponse>()),
      getObjectInfoRequest: types.optional(RequestModel, {}),
      updateAsset2dRequest: types.optional(RequestModel, {}),
      assets2D: types.optional(types.frozen<Record<string, string>>(), {
        '0d99e5aa-a627-4353-8bfa-1c0e7053db90': 'google drive Local',
        '2a879830-b79e-4c35-accc-05607c51d504': 'miro local',
        '7be0964f-df73-4880-91f5-22eef9967999': 'image',
        'bda25d5d-2aab-45b4-9e8a-23579514cec1': 'video',
        'be0d0ca3-c50b-401a-89d9-0e59fc45c5c2': 'text',
        'a31722a6-26b7-46bc-97f9-435c380c3ca9': 'miro',
        'c601404b-61a2-47d5-a5c7-f3c704a8bf58': 'google Drive'
      })
    })
  )
  .actions((self) => ({
    fetchObject: flow(function* (objectId: string) {
      self.objectInfo = yield self.getObjectInfoRequest.send(api.spaceInfoRepository.getSpaceInfo, {
        spaceId: objectId
      });
    }),
    updateAsset2d: flow(function* (asset2dId: string) {})
  }));

export {WorldBuilderObjectStore};
