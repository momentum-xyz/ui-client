import {cast, flow, types} from 'mobx-state-tree';
import {AttributeNameEnum} from '@momentum-xyz/sdk';
import {Event3dEmitter, RequestModel, ResetModel} from '@momentum-xyz/core';

import {api} from 'api';
import {PluginIdEnum} from 'api/enums';
import {storage} from 'shared/services';
import {StorageKeyEnum} from 'core/enums';
import {MusicPlayer} from 'core/models';

const DEFAULT_VOLUME_PERCENT = 25;

const MusicStore = types
  .compose(
    ResetModel,
    types.model('MusicStore', {
      musicPlayer: types.optional(MusicPlayer, {}),
      fetchRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    initVolume(): void {
      const stored = storage.get<string>(StorageKeyEnum.VolumeLevel);
      self.musicPlayer.volume = stored ? Number(stored) : DEFAULT_VOLUME_PERCENT;
    },
    setVolume(volumePercent: number): void {
      storage.setString(StorageKeyEnum.VolumeLevel, volumePercent.toString());
      self.musicPlayer.setVolume(volumePercent);
    }
  }))
  .actions((self) => ({
    loadTracks: flow(function* (worldId: string) {
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
    subscribe: () => {
      Event3dEmitter.on('SoundtrackChanged', self.musicPlayer.refreshTracks);
    },
    unsubscribe: () => {
      Event3dEmitter.off('SoundtrackChanged', self.musicPlayer.refreshTracks);
    }
  }))
  .actions((self) => ({
    async init(worldId: string) {
      self.initVolume();
      await self.loadTracks(worldId);

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

export {MusicStore};
