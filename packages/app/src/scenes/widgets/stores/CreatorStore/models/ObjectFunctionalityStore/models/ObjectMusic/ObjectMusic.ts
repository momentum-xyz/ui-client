import {cast, flow, types} from 'mobx-state-tree';
import {AttributeNameEnum} from '@momentum-xyz/sdk';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {api} from 'api';
import {PluginIdEnum} from 'api/enums';
import {MusicPlayer} from 'core/models';

const DEFAULT_VOLUME_PERCENT = 25;

const ObjectMusic = types
  .compose(
    ResetModel,
    types.model('ObjectMusic', {
      musicPlayer: types.optional(MusicPlayer, {}),
      fetchRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    initVolume(): void {
      // TODO
      self.musicPlayer.volume = DEFAULT_VOLUME_PERCENT;
    },
    setVolume(volumePercent: number): void {
      // TODO
      self.musicPlayer.volume = volumePercent;
    }
  }))
  .actions((self) => ({
    // TODO
    fetchTracks: flow(function* (worldId: string) {
      const attributeResponse = yield self.fetchRequest.send(
        api.spaceAttributeRepository.getSpaceAttribute,
        {
          spaceId: worldId,
          plugin_id: PluginIdEnum.CORE,
          attribute_name: AttributeNameEnum.SOUNDTRACK
        }
      );

      if (attributeResponse) {
        self.musicPlayer.refreshTracks(cast(attributeResponse.tracks || []));
      }
    })
  }))
  .actions((self) => ({
    async init(worldId: string, objectId: string) {
      self.initVolume();
      await self.fetchTracks(worldId);

      if (self.musicPlayer.tracks.length > 0) {
        self.musicPlayer.start(self.musicPlayer.tracks[0].render_hash);
      }
    }
  }))
  .views((self) => ({
    get isAvailable(): boolean {
      return self.musicPlayer.tracks.length > 0;
    },
    get hasActiveTrack(): boolean {
      return !!self.musicPlayer.activeTrack;
    }
  }));

export {ObjectMusic};
