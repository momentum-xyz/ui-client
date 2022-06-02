import {types} from 'mobx-state-tree';
import ReactHowler from 'react-howler';
import raf from 'raf';

const MusicPlayer = types
  .model('MusicPlayer', {
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
    seekPosRenderer: types.maybe(types.number)
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
    startLoading() {
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
        self.seekPosRenderer = raf(this.renderSeekPos);
      }
    },
    toggleLoop() {
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
    seekingChange(e: any) {
      self.seek = parseFloat(e.target.value);
    },
    resetSeekPosRenderer() {
      raf.cancel(self.seekPosRenderer ?? 0);
      self.seek = 0.0;
    },
    startedPlaying() {
      // self.playing = true;
      this.renderSeekPos();
    },
    stoppedPlaying() {
      self.player?.stop();
      self.isPlaying = false; // Need to update our local state so we don't immediately invoke autoplay
      self.next = false;
      this.renderSeekPos();
    },
    mute() {
      if (self.muted) {
        this.toggleMute();
        this.setVolume(0.1);
      } else if (self.volume <= 0.9) {
        this.setVolume(self.volume + 0.1);
      } else {
        this.setVolume(1);
      }
    },
    unmute() {
      if (self.muted) {
        return;
      }
      this.toggleMute();
      this.setVolume(0);
    }
  }))
  .views((self) => ({
    get calculateDurationBarWidth() {
      return `${(self.seek / self.duration) * 100}%`;
    }
  }));

export {MusicPlayer};
