import {types} from 'mobx-state-tree';
import ReactHowler from 'react-howler';
// @ts-ignore
import raf from 'raf';

import {DialogModel, ResetModel} from 'core/models';

import {PlayListStore, UnityVolume} from './models';

const MusicPlayerStore = types.compose(
  ResetModel,
  types
    .model('MusicPlayerStore', {
      musicPlayerWidget: types.optional(DialogModel, {}),
      unityVolumeStore: types.optional(UnityVolume, {}),
      playlistStore: types.optional(PlayListStore, {}),
      isPlaying: types.optional(types.boolean, true),
      start: types.optional(types.boolean, false),
      next: types.optional(types.boolean, true),
      loaded: types.optional(types.boolean, false),
      loop: types.optional(types.boolean, true),
      muted: types.optional(types.boolean, false),
      volume: types.optional(types.number, 0.2),
      duration: types.optional(types.number, 0),
      seek: types.optional(types.number, 0.0),
      rate: types.optional(types.number, 1),
      isSeeking: types.optional(types.boolean, false),
      html5: types.optional(types.boolean, true),
      _raf: types.maybeNull(types.frozen<raf>())
    })
    .volatile<{player: ReactHowler | null}>(() => ({
      player: null
    }))
    .actions((self) => ({
      setPlayer(ref: ReactHowler | null) {
        self.player = ref;
      },
      setVolume(volume: number) {
        self.volume = volume;
      },
      togglePlayback() {
        if (self.playlistStore.tracks.length < 1) {
          return;
        }
        self.isPlaying = !self.isPlaying;
        if (!self.isPlaying) {
          self.next = false;
        } else {
          self.start = true;
          self.next = true;
        }
      },
      handleOnLoad() {
        if (!self.player) {
          return;
        }
        self.loaded = true;
        self.duration = self.player.duration();
      },
      renderSeekPos() {
        if (!self.player) {
          return;
        }
        if (!self.isSeeking) {
          self.seek = self.player.seek();
        }
        if (self.isPlaying) {
          self._raf = raf(this.renderSeekPos);
        }
      },
      handleLoopToggle() {
        self.loop = !self.loop;
      },
      toggleMute() {
        self.muted = !self.muted;
      },
      seekingStarted() {
        self.isSeeking = true;
      },
      seekingEnded(e: any) {
        self.isSeeking = false;

        self.player?.seek(e.target.value);
      },
      handleSeekingChange(e: any) {
        self.seek = parseFloat(e.target.value);
      },
      resetSeekPosRenderer() {
        raf.cancel(self._raf);
        self.seek = 0.0;
      }
    }))
    .actions((self) => ({
      startedPlaying() {
        // self.playing = true;
        self.renderSeekPos();
      },
      stoppedPlaying() {
        self.player?.stop();
        self.isPlaying = false; // Need to update our local state so we don't immediately invoke autoplay
        self.next = false;
        self.renderSeekPos();
      },
      mute() {
        if (self.muted) {
          self.toggleMute();
          self.setVolume(0.1);
        } else if (self.volume <= 0.9) {
          self.setVolume(self.volume + 0.1);
        } else {
          self.setVolume(1);
        }
      },
      unmute() {
        if (self.muted) {
          return;
        }
        self.toggleMute();
        self.setVolume(0);
      },
      nextSong() {
        if (self.playlistStore.tracks.length < 1) {
          return;
        }
        self.seek = 0.0;
        self.isPlaying = false;
        if (self.playlistStore.tracks.length - 1 > self.playlistStore.currentSrcIndex) {
          self.playlistStore.next();
          if (self.next && self.start) {
            self.togglePlayback();
          }
        } else if (
          self.playlistStore.tracks.length - 1 === self.playlistStore.currentSrcIndex &&
          self.loop
        ) {
          self.playlistStore.first();
          if (self.next && self.start) {
            self.togglePlayback();
          }
        } else if (
          self.playlistStore.tracks.length - 1 === self.playlistStore.currentSrcIndex &&
          !self.loop
        ) {
          self.playlistStore.first();
        }
      }
    }))
    .actions((self) => ({
      songEnded() {
        self.isPlaying = false;
        self.resetSeekPosRenderer();
        self.nextSong();
      },
      previousSong() {
        if (self.playlistStore.tracks.length < 1) {
          return;
        }
        self.seek = 0.0;
        if (self.playlistStore.currentSrcIndex > 0) {
          self.playlistStore.previous();
        } else if (self.playlistStore.currentSrcIndex === 0) {
          self.playlistStore.first();
          self.stoppedPlaying();
        }
      }
    }))
    .views((self) => ({
      get calculateDurationBarWidth() {
        return `${(self.seek / self.duration) * 100}%`;
      }
    }))
);

export {MusicPlayerStore};
