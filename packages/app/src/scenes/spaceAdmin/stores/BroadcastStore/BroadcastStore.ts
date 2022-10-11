import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel, Dialog} from '@momentum/core';

import {api, BroadcastInterface, LiveStreamInterface} from 'api';
import {BroadcastStatusEnum, IntegrationTypeEnum} from 'core/enums';
import {youtubeVideoPath} from 'core/utils';

const BroadcastStore = types.compose(
  ResetModel,
  types
    .model('BroadcastStore', {
      countdownDialog: types.optional(Dialog, {}),
      stopBroadcastingDialog: types.optional(Dialog, {}),
      enableRequest: types.optional(RequestModel, {}),
      disableRequest: types.optional(RequestModel, {}),
      fetchRequest: types.optional(RequestModel, {}),
      broadcast: types.optional(types.frozen<BroadcastInterface>(), {}),
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
          self.previewHash = response.data.url;
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
        }

        return self.disableRequest.isDone;
      }),
      setBroadcastPreview(preview: BroadcastInterface): void {
        const hash = youtubeVideoPath(preview?.youtubeUrl ?? '', undefined);
        if (hash && preview.youtubeUrl) {
          self.previewHash = hash;
          self.youtubeUrl = preview.youtubeUrl;
        } else {
          self.previewHash = '';
        }
      },
      setBroadcast(broadcast: LiveStreamInterface): void {
        self.broadcast = cast(broadcast);
        if (broadcast.broadcastStatus === BroadcastStatusEnum.STOP) {
          self.previewHash = '';
        }
      }
    }))
    .views((self) => ({
      get isStreaming(): boolean {
        return self.broadcast.broadcastStatus === BroadcastStatusEnum.PLAY;
      }
    }))
);

export {BroadcastStore};
