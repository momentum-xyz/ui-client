import {cast, flow, types} from 'mobx-state-tree';

import {Integration, RequestModel, ResetModel} from 'core/models';
import {api, BroadcastInterface} from 'api';
import {BroadcastStatusEnum, IntegrationTypeEnum} from 'core/enums';
import {youtubeVideoPath} from 'core/utils';

const BroadcastStore = types.compose(
  ResetModel,
  types
    .model('BroadcastStore', {
      enableRequest: types.optional(RequestModel, {}),
      disableRequest: types.optional(RequestModel, {}),
      fetchRequest: types.optional(RequestModel, {}),
      broadcast: types.maybe(Integration),
      isYoutubeHash: false,
      isBroadcast: false,
      broadcastStatus: types.maybe(types.string),
      youtubeHash: types.maybe(types.string),
      youtubeUrl: types.maybe(types.string)
    })
    .actions((self) => ({
      fetchBroadcast: flow(function* (spaceId: string) {
        const response = yield self.fetchRequest.send(api.integrationRepository.fetchIntegration, {
          integrationType: IntegrationTypeEnum.BROADCAST,
          spaceId: spaceId
        });

        if (response) {
          self.broadcast = cast(response);

          self.broadcastStatus = response.data.broadcastStatus;
          self.youtubeHash = response.data.url;
          self.youtubeUrl = response.data.youtubeUrl;
        }
      }),
      enableBroadcast: flow(function* (spaceId: string) {
        yield self.enableRequest.send(api.integrationRepository.enableBroadcastIntegration, {
          spaceId: spaceId,
          data: {
            broadcastStatus: BroadcastStatusEnum.PLAY,
            url: self.youtubeHash,
            youtubeUrl: self.youtubeUrl
          }
        });
        self.broadcastStatus = BroadcastStatusEnum.PLAY;
        return self.enableRequest.isDone;
      }),
      disableBroadcast: flow(function* (spaceId: string) {
        yield self.disableRequest.send(api.integrationRepository.disableBroadcastIntegration, {
          spaceId: spaceId
        });
        self.broadcastStatus = BroadcastStatusEnum.STOP;
        self.youtubeHash = '';
        self.youtubeUrl = '';
        self.isYoutubeHash = false;
        return self.disableRequest.isDone;
      }),
      setBroadcastPreview(preview: BroadcastInterface) {
        const hash = youtubeVideoPath(preview?.youtubeUrl ?? '', undefined);
        if (hash && preview.youtubeUrl) {
          self.youtubeHash = hash;
          self.youtubeUrl = preview.youtubeUrl;
          self.isYoutubeHash = true;
        } else {
          self.youtubeHash = '';
          self.isYoutubeHash = false;
        }
      },
      setBroadcast(broadcast: BroadcastInterface) {
        self.youtubeHash = broadcast.url;
        self.broadcastStatus = broadcast.broadcastStatus;
        self.youtubeUrl = broadcast.youtubeUrl;
      }
    }))
);

export {BroadcastStore};
