import {cast, flow, types} from 'mobx-state-tree';
import ReactHowler from 'react-howler';
import {MediaFileInterface, RequestModel, ResetModel} from '@momentum-xyz/core';
import {TrackStateInterface} from '@momentum-xyz/ui-kit';
import {AttributeNameEnum} from '@momentum-xyz/sdk';

import {api} from 'api';
import {PluginIdEnum} from 'api/enums';
import {storage} from 'shared/services';
import {TrackInfo} from 'core/models';
import {StorageKeyEnum} from 'core/enums';
import {getTrackAbsoluteUrl} from 'core/utils';

const DEFAULT_VOLUME_PERCENT = 30;

const MusicStore = types
  .compose(
    ResetModel,
    types.model('MusicStore', {
      tracks: types.optional(types.array(TrackInfo), []),
      volume: types.optional(types.number, DEFAULT_VOLUME_PERCENT),
      trackHash: types.maybeNull(types.string),
      isPlaying: false,
      durationSec: 0,
      playedSec: 0,
      fetchRequest: types.optional(RequestModel, {})
    })
  )
  .volatile<{player: ReactHowler | null; watcher: NodeJS.Timer | null}>(() => ({
    player: null,
    watcher: null
  }))
  .actions((self) => ({
    initVolume(): void {
      const stored = storage.get<string>(StorageKeyEnum.VolumeLevel);
      self.volume = stored ? Number(stored) : DEFAULT_VOLUME_PERCENT;
    },
    setVolume(volumePercent: number): void {
      storage.setString(StorageKeyEnum.VolumeLevel, volumePercent.toString());
      self.volume = volumePercent;
    },
    setPlayer(player: ReactHowler) {
      self.player = player;
    },
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
        self.tracks = cast(attributeResponse.tracks || []);
      }
    })
  }))
  .actions((self) => ({
    start(trackHash: string): void {
      if (self.tracks.some((item) => item.render_hash === trackHash)) {
        self.isPlaying = true;
        self.trackHash = trackHash;
        self.playedSec = 0;
      }
    },
    play(): void {
      self.isPlaying = true;
    },
    pause(): void {
      self.isPlaying = false;
    },
    stop(): void {
      self.isPlaying = false;
      self.trackHash = null;
    }
  }))
  .actions((self) => ({
    setDuration(): void {
      self.durationSec = self.player?.howler.duration() || 0;
    },
    setHowlerSeek(sec: number): void {
      self.player?.seek(sec);
      self.playedSec = sec;
    },
    setSeekPosition(): void {
      if (self.isPlaying) {
        self.playedSec = self.player?.howler.seek() || 0;
      }
    },
    watchSeekPosition(): void {
      if (self.watcher) {
        clearInterval(self.watcher);
      }
      self.watcher = setInterval(() => {
        this.setSeekPosition();
      }, 1000);
    },
    startNextTrack(): void {
      const currentIndex = self.tracks.findIndex((t) => t.render_hash === self.trackHash);
      const targetIndex = currentIndex === self.tracks.length - 1 ? 0 : currentIndex + 1;

      self.trackHash = self.tracks[targetIndex].render_hash;
      this.setHowlerSeek(0);
    }
  }))
  .actions((self) => ({
    async init(worldId: string) {
      self.initVolume();
      await self.fetchTracks(worldId);

      if (self.tracks.length > 0) {
        self.start(self.tracks[0].render_hash);
      }
    }
  }))
  .views((self) => ({
    get isAvailable(): boolean {
      return self.tracks.length > 0;
    },
    get trackList(): MediaFileInterface[] {
      return self.tracks.map((item) => ({
        name: item.name,
        hash: item.render_hash,
        url: getTrackAbsoluteUrl(item.render_hash) || ''
      }));
    },
    get activeTrack(): MediaFileInterface | null {
      return this.trackList.find((track) => track.hash === self.trackHash) || null;
    },
    get activeTrackState(): TrackStateInterface {
      const isDurationAvailable = !!this.activeTrack && self.durationSec;
      return {
        isPlaying: self.isPlaying,
        isStopped: !this.activeTrack,
        durationSec: self.durationSec,
        playedSec: self.playedSec,
        playedPercent: isDurationAvailable ? (self.playedSec * 100) / self.durationSec : 0
      };
    },
    get howlerProps() {
      return {
        html5: true,
        src: this.activeTrack?.url || '',
        playing: self.isPlaying,
        volume: self.volume / 100,
        onLoad: self.setDuration,
        onPlay: self.watchSeekPosition,
        onEnd: self.startNextTrack
      };
    }
  }));

export {MusicStore};
