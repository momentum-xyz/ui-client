import {cast, types} from 'mobx-state-tree';
import {MediaFileInterface, ResetModel} from '@momentum-xyz/core';
import ReactHowler from 'react-howler';

import {storage} from 'shared/services';
import {StorageKeyEnum} from 'core/enums';

const DEFAULT_VOLUME_PERCENT = 30;

const MusicStore = types
  .compose(
    ResetModel,
    types.model('MusicStore', {
      isPlaying: false,
      volume: DEFAULT_VOLUME_PERCENT,
      tracks: types.optional(types.array(types.frozen<MediaFileInterface>()), []),
      activeTrackHash: types.maybeNull(types.string)
    })
  )
  .volatile<{player: ReactHowler | null}>(() => ({
    player: null
  }))
  .actions((self) => ({
    init(): void {
      const stored = storage.get<string>(StorageKeyEnum.VolumeLevel);
      self.volume = stored ? Number(stored) : DEFAULT_VOLUME_PERCENT;
    },
    setVolume(volumePercent: number): void {
      storage.setString(StorageKeyEnum.VolumeLevel, volumePercent.toString());
      self.volume = volumePercent;
    },
    setPlayer(player: ReactHowler) {
      self.player = player;
    }
  }))
  .actions((self) => ({
    setTracks(tracks: MediaFileInterface[]): void {
      self.tracks = cast(tracks);
    }
  }))
  .actions((self) => ({
    start(trackHash: string): void {
      if (self.tracks.some((item) => item.hash === trackHash)) {
        self.isPlaying = true;
        self.activeTrackHash = trackHash;
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
      self.activeTrackHash = null;
    }
  }))
  .views((self) => ({
    get activeTrack(): MediaFileInterface | null {
      return self.tracks.find((track) => track.hash === self.activeTrackHash) || null;
    },
    get howlerProps() {
      return {
        src: this.activeTrack?.url || '',
        playing: self.isPlaying,
        volume: self.volume / 100,
        html5: true
      };
    }
  }));

export {MusicStore};
