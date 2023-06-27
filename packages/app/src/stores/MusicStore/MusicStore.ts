import {cast, types} from 'mobx-state-tree';
import {MediaFileInterface, ResetModel} from '@momentum-xyz/core';
import ReactHowler from 'react-howler';
import raf from 'raf';

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

      trackHash: types.maybeNull(types.string),
      durationSec: 0,
      playedSec: 0,
      _raf: 0
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
        self.trackHash = trackHash;
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
      console.log('DURATION', self.durationSec);
    },
    setHowlerSeek(sec: number): void {
      self.player?.seek(sec);
    },
    setSeekPosition(): void {
      if (self.isPlaying) {
        self.playedSec = self.player?.howler.seek() || 0;
        console.log('PLAYED', self.playedSec);
        self._raf = raf(this.setSeekPosition);
      }
    },
    trackEnded: () => {
      // TODO LOOP (!)
      self.isPlaying = false;
      self.trackHash = null;
      self.durationSec = 0;
      self.playedSec = 0;
    }
  }))
  .views((self) => ({
    get activeTrack(): MediaFileInterface | null {
      return self.tracks.find((track) => track.hash === self.trackHash) || null;
    },
    get howlerProps() {
      return {
        html5: true,
        src: this.activeTrack?.url || '',
        playing: self.isPlaying,
        volume: self.volume / 100,
        onLoad: self.setDuration,
        onPlay: self.setSeekPosition,
        onEnd: self.trackEnded
      };
    }
  }));

export {MusicStore};
