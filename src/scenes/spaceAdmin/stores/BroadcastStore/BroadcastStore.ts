import {cast, flow, types} from 'mobx-state-tree';

import {RequestModel, ResetModel} from 'core/models';
import {api, BroadcastInterface, LiveStreamInterface} from 'api';
import {BroadcastStatusEnum, IntegrationTypeEnum} from 'core/enums';
import {youtubeVideoPath} from 'core/utils';

const BroadcastStore = types.compose(
  ResetModel,
  types
    .model('BroadcastStore', {
      enableRequest: types.optional(RequestModel, {}),
      disableRequest: types.optional(RequestModel, {}),
      fetchRequest: types.optional(RequestModel, {}),
      broadcast: types.optional(types.frozen<BroadcastInterface>(), {}),
      isYoutubeHash: false,
      isBroadcast: false,
      broadcastStatus: types.maybe(types.string),
      previewHash: types.maybe(types.string),
      youtubeUrl: types.maybe(types.string)
    })
    .actions((self) => ({
      fetchBroadcast: flow(function* (spaceId: string) {
        const response = yield self.fetchRequest.send(api.integrationRepository.fetchIntegration, {
          integrationType: IntegrationTypeEnum.BROADCAST,
          spaceId: spaceId
        });

        if (response) {
          self.broadcast = cast(response.data);
        }
      }),
      enableBroadcast: flow(function* (spaceId: string) {
        const response = yield self.enableRequest.send(
          api.integrationRepository.enableBroadcastIntegration,
          {
            spaceId: spaceId,
            data: {
              broadcastStatus: BroadcastStatusEnum.PLAY,
              url: self.previewHash,
              youtubeUrl: self.youtubeUrl
            }
          }
        );
        if (response) {
          self.broadcast = cast(response.data);
        }
        return self.enableRequest.isDone;
      }),
      disableBroadcast: flow(function* (spaceId: string) {
        const response = yield self.disableRequest.send(
          api.integrationRepository.disableBroadcastIntegration,
          {
            spaceId: spaceId
          }
        );
        if (response) {
          self.broadcast = cast(response.data);
          self.previewHash = '';
          self.isYoutubeHash = false;
        }

        return self.disableRequest.isDone;
      }),
      setBroadcastPreview(preview: BroadcastInterface) {
        const hash = youtubeVideoPath(preview?.youtubeUrl ?? '', undefined);
        if (hash && preview.youtubeUrl) {
          self.previewHash = hash;
          self.youtubeUrl = preview.youtubeUrl;
          self.isYoutubeHash = true;
        } else {
          self.previewHash = '';
          self.isYoutubeHash = false;
        }
      },
      setBroadcast(broadcast: LiveStreamInterface) {
        self.broadcast = cast(broadcast);
        if (broadcast.broadcastStatus === BroadcastStatusEnum.STOP) {
          self.previewHash = '';
          self.isYoutubeHash = false;
        }
      }
    }))
    .views((self) => ({
      get isStreaming() {
        return self.broadcast.broadcastStatus === BroadcastStatusEnum.PLAY;
      }
    }))
);

export {BroadcastStore};
