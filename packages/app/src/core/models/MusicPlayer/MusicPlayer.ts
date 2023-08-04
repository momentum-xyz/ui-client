import {cast, Instance, types} from 'mobx-state-tree';
import ReactHowler from 'react-howler';
import {MediaFileInterface, ResetModel} from '@momentum-xyz/core';
import {TrackStateInterface} from '@momentum-xyz/ui-kit';

import {getTrackAbsoluteUrl} from 'core/utils';
import {TrackInfo, TrackInfoModelInterface} from 'core/models/TrackInfo';

const DISTANCE_MAX_VALUE = 10;

const MusicPlayer = types
  .compose(
    ResetModel,
    types.model('MusicPlayer', {
      tracks: types.optional(types.array(TrackInfo), []),
      trackHash: types.maybeNull(types.string),
      isDistanceShown: false,
      isActiveTrackShown: true,
      isSeeking: false,
      isPlaying: false,
      durationSec: 0,
      playedSec: 0,
      distance: 0,
      volume: 0
    })
  )
  .volatile<{player: ReactHowler | null; watcher: NodeJS.Timer | null}>(() => ({
    player: null,
    watcher: null
  }))
  .actions((self) => ({
    setPlayer(player: ReactHowler) {
      self.player = player;
    },
    setVolume(volumePercent: number): void {
      self.volume = volumePercent;
    },
    setDistance(distance: number): void {
      self.distance = distance;
    },
    setDistanceByPercent(distancePercent: number): void {
      const distanceQ = (DISTANCE_MAX_VALUE * distancePercent) / 100;
      self.distance = distanceQ < 0 ? 0 : Math.exp(distanceQ) - 1;
    },
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
      self.durationSec = 0;
      self.playedSec = 0;
    }
  }))
  .actions((self) => ({
    setDuration(): void {
      self.durationSec = self.player?.howler.duration() || 0;
    },
    setIsSeeking(isSeeking: boolean): void {
      self.isSeeking = isSeeking;
      if (!self.isSeeking) {
        self.player?.seek(self.playedSec);
      }
    },
    setHowlerSeek(sec: number): void {
      self.playedSec = sec;
      if (!self.isSeeking) {
        self.player?.seek(sec);
      }
    },
    setSeekPosition(): void {
      if (!self.isSeeking && self.isPlaying) {
        self.playedSec = self.player?.howler.seek() || 0;
      }
    },
    watchSeekPosition(): void {
      if (self.watcher) {
        clearInterval(self.watcher);
      }
      self.watcher = setInterval(() => {
        this.setSeekPosition();
      }, 500);
    },
    startNextTrack(): void {
      const currentIndex = self.tracks.findIndex((t) => t.render_hash === self.trackHash);
      const targetIndex = currentIndex === self.tracks.length - 1 ? 0 : currentIndex + 1;

      self.trackHash = self.tracks[targetIndex].render_hash;
      this.setHowlerSeek(0);
    }
  }))
  .actions((self) => ({
    refreshTracks(tracks: TrackInfoModelInterface[]): void {
      // New track list doesn't have the track which is playing now
      if (!tracks.some((t) => t.render_hash === self.trackHash)) {
        self.stop();
      }
      self.tracks = cast(tracks);
    }
  }))
  .views((self) => ({
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
    get distancePercent() {
      return (Math.log(self.distance + 1) * 100) / DISTANCE_MAX_VALUE;
    },
    get howlerProps() {
      return {
        loop: true,
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

export type MusicPlayerModelType = Instance<typeof MusicPlayer>;

export {MusicPlayer};
