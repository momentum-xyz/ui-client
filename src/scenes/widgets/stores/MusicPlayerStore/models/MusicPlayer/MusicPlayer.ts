import {types} from 'mobx-state-tree';
import ReactHowler from 'react-howler';
import raf from 'raf';

const MusicPlayer = types
  .model('MusicPlayer', {
    isPlaying: types.optional(types.boolean, true),
    firstLoadNextShouldBePlaying: types.optional(types.boolean, false),
    nextSongShouldBePlaying: types.optional(types.boolean, true),
    loaded: types.optional(types.boolean, false),
    loop: types.optional(types.boolean, true),
    muted: types.optional(types.boolean, false),
    volume: types.optional(types.number, 0.1),
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
    startLoading(): void {
      if (!self.player) {
        return;
      }
      self.loaded = true;
      self.duration = self.player.duration();
    },
    renderSeekPos(): void {
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
    toggleLoop(): void {
      self.loop = !self.loop;
    },
    toggleMute(): void {
      self.muted = !self.muted;
    },
    seekingStarted(): void {
      self.isSeeking = true;
    },
    seekingEnded(seekValue: string) {
      self.isSeeking = false;
      self.player?.seek(+seekValue);
    },
    seekingChange(seekValue: string) {
      self.seek = parseFloat(seekValue);
    },
    resetSeekPosRenderer(): void {
      raf.cancel(self.seekPosRenderer ?? 0);
      self.seek = 0.0;
    },
    startedPlaying(): void {
      // self.playing = true;
      this.renderSeekPos();
    },
    stoppedPlaying(): void {
      self.player?.stop();
      self.isPlaying = false; // Need to update our local state so we don't immediately invoke autoplay
      self.nextSongShouldBePlaying = false;
      this.renderSeekPos();
    },
    mute(): void {
      if (self.muted) {
        this.toggleMute();
        this.setVolume(0.1);
      } else if (self.volume <= 0.9) {
        this.setVolume(self.volume + 0.1);
      } else {
        this.setVolume(1);
      }
    },
    unmute(): void {
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
