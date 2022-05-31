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
      playing: types.optional(types.boolean, false),
      currentPlaying: types.optional(types.boolean, false),
      loaded: types.optional(types.boolean, false),
      loop: types.optional(types.boolean, false),
      mute: types.optional(types.boolean, false),
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
      handleToggle() {
        console.info('toggle');

        console.info(self.playing);

        self.playing = !self.playing;
        self.currentPlaying = !self.currentPlaying;
      },
      handleOnLoad() {
        console.info('onLoad');
        if (!self.player) {
          return;
        }
        self.loaded = true;
        self.duration = self.player.duration();
        console.info(self.duration);
      },
      renderSeekPos() {
        if (!self.player) {
          return;
        }
        if (!self.isSeeking) {
          self.seek = self.player.seek();
        }
        if (self.playing) {
          self._raf = raf(this.renderSeekPos);
          console.info(self._raf);
        }
      },
      handleLoopToggle() {
        self.loop = !self.loop;
      },
      handleMuteToggle() {
        self.mute = !self.mute;
      },
      handleMouseDownSeek() {
        self.isSeeking = true;
      },
      handleMouseUpSeek(e: any) {
        self.isSeeking = false;

        self.player?.seek(e.target.value);
      },
      handleSeekingChange(e: any) {
        self.seek = parseFloat(e.target.value);
      },
      clearRAF() {
        raf.cancel(self._raf);
      }
    }))
    .actions((self) => ({
      handleOnPlay() {
        console.info('onPlay');

        // self.playing = true;
        self.renderSeekPos();
      },

      handleStop() {
        self.player?.stop();
        self.playing = false; // Need to update our local state so we don't immediately invoke autoplay
        self.renderSeekPos();
      },
      handleUnmuteButton() {
        if (self.mute) {
          self.handleMuteToggle();
          self.setVolume(0.1);
        } else if (self.volume <= 0.9) {
          self.setVolume(self.volume + 0.1);
        } else {
          self.setVolume(1);
        }
      },
      handleMuteButton() {
        if (self.mute) {
          return;
        }
        self.handleMuteToggle();
        self.setVolume(0);
      },
      handleNext() {
        console.info('playing', self.playing);
        console.info('cplaying', self.currentPlaying);
        if (self.playlistStore.tracks.length - 1 > self.playlistStore.currentSrcIndex) {
          self.playlistStore.next();
        } else if (
          self.playlistStore.tracks.length - 1 === self.playlistStore.currentSrcIndex &&
          self.loop
        ) {
          self.playlistStore.first();
          if (self.playing) {
            self.handleToggle();
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
      handleOnEnd() {
        self.playing = false;
        self.clearRAF();
        self.handleNext();
      }
    }))
    .actions((self) => ({
      init() {
        console.info('init');
        self.handleToggle = self.handleToggle.bind(self);
        self.handleOnLoad = self.handleOnLoad.bind(self);
        self.handleOnPlay = self.handleOnPlay.bind(self);
        self.handleOnEnd = self.handleOnEnd.bind(self);
        self.handleStop = self.handleStop.bind(self);
        self.renderSeekPos = self.renderSeekPos.bind(self);
        self.handleLoopToggle = self.handleLoopToggle.bind(self);
        self.handleMuteToggle = self.handleMuteToggle.bind(self);
        self.handleMouseDownSeek = self.handleMouseDownSeek.bind(self);
        self.handleMouseUpSeek = self.handleMouseUpSeek.bind(self);
        self.handleSeekingChange = self.handleSeekingChange.bind(self);
      },
      handlePrevious() {
        if (self.playlistStore.currentSrcIndex > 0) {
          self.playlistStore.previous();
        } else if (self.playlistStore.currentSrcIndex === 0) {
          self.playlistStore.first();
          self.handleStop();
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
