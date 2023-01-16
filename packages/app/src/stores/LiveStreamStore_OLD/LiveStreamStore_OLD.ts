import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {api, BroadcastInterface, LiveStreamInterface} from 'api';
import {BroadcastStatusEnum, IntegrationTypeEnum} from 'core/enums';

const LiveStreamStore_OLD = types.compose(
  ResetModel,
  types
    .model('LiveStreamStore_OLD', {
      disableRequest: types.optional(RequestModel, {}),
      fetchRequest: types.optional(RequestModel, {}),
      broadcast: types.optional(types.frozen<BroadcastInterface>(), {}),
      spaceName: types.maybe(types.string),
      showLiveStream: true,
      isLiveStreamTab: false
    })
    .actions((self) => ({
      fetchBroadcast: flow(function* (spaceId: string) {
        const response = yield self.fetchRequest.send(api.integrationRepository.fetchIntegration, {
          integrationType: IntegrationTypeEnum.BROADCAST,
          spaceId: spaceId
        });

        if (response) {
          self.broadcast = cast(response.data);
          self.spaceName = response.space.name;
        }
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
        }

        return self.disableRequest.isDone;
      }),
      setBroadcast(broadcast: LiveStreamInterface): void {
        self.broadcast = cast(broadcast);
      },
      showWidget(): void {
        self.showLiveStream = true;
      },
      hideWidget(): void {
        self.showLiveStream = false;
      },
      enteredLiveStreamTab(): void {
        self.isLiveStreamTab = true;
      },
      leftLiveStreamTab(): void {
        self.isLiveStreamTab = false;
      }
    }))
    .views((self) => ({
      get isStreaming(): boolean {
        return self.broadcast.broadcastStatus === BroadcastStatusEnum.PLAY;
      },
      get isLiveStreamShown(): boolean {
        return !!self.broadcast.url && self.showLiveStream;
      }
    }))
);

export {LiveStreamStore_OLD};
