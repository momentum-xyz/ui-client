import {types} from 'mobx-state-tree';
import {Dialog, ResetModel} from '@momentum/core';

import {MusicPlayer, Playlist} from './models';

const MusicPlayerStore = types.compose(
  ResetModel,
  types
    .model('MusicPlayerStore', {
      musicPlayerWidget: types.optional(Dialog, {}),
      playlist: types.optional(Playlist, {}),
      musicPlayer: types.optional(MusicPlayer, {}),
      isPausedInSpace: types.optional(types.boolean, false),
      isInSpace: false
    })
    .actions((self) => ({
      init(worldId: string): void {
        self.playlist.fetchPlaylist(worldId);
      },
      togglePlayback(): void {
        if (self.playlist.tracks.length < 1) {
          return;
        }
        if (self.isInSpace && self.musicPlayer.isPlaying && !self.isPausedInSpace) {
          self.isPausedInSpace = true;
        }
        self.musicPlayer.isPlaying = !self.musicPlayer.isPlaying;
        if (!self.musicPlayer.isPlaying) {
          self.musicPlayer.nextSongShouldBePlaying = false;
        } else {
          self.musicPlayer.firstLoadNextShouldBePlaying = true;
          self.musicPlayer.nextSongShouldBePlaying = true;
        }
      },
      nextSong(): void {
        if (self.playlist.tracks.length < 1) {
          return;
        }
        self.musicPlayer.firstLoadNextShouldBePlaying = true;
        self.musicPlayer.seek = 0.0;
        self.musicPlayer.isPlaying = false;
        if (self.playlist.tracks.length - 1 > self.playlist.currentSrcIndex) {
          self.playlist.next();
          if (
            self.musicPlayer.nextSongShouldBePlaying &&
            self.musicPlayer.firstLoadNextShouldBePlaying
          ) {
            this.togglePlayback();
          }
        } else if (
          self.playlist.tracks.length - 1 === self.playlist.currentSrcIndex &&
          self.musicPlayer.loop
        ) {
          self.playlist.first();
          if (
            self.musicPlayer.nextSongShouldBePlaying &&
            self.musicPlayer.firstLoadNextShouldBePlaying
          ) {
            this.togglePlayback();
          }
        } else if (
          self.playlist.tracks.length - 1 === self.playlist.currentSrcIndex &&
          !self.musicPlayer.loop
        ) {
          self.playlist.first();
        }
      },
      songEnded(): void {
        self.musicPlayer.isPlaying = false;
        self.musicPlayer.resetSeekPosRenderer();
        this.nextSong();
      },
      previousSong(): void {
        if (self.playlist.tracks.length < 1) {
          return;
        }
        self.musicPlayer.seek = 0.0;
        if (self.playlist.currentSrcIndex > 0) {
          self.playlist.previous();
        } else if (self.playlist.currentSrcIndex === 0) {
          self.playlist.first();
          self.musicPlayer.stoppedPlaying();
        }
      },
      togglePlaybackInSpace(joined: boolean) {
        if (self.musicPlayer.isPlaying && joined) {
          this.togglePlayback();
          this.enteredSpace();
        } else if (!self.musicPlayer.isPlaying && self.isInSpace && !self.isPausedInSpace) {
          this.togglePlayback();
          this.leftSpace();
        } else if (!joined) {
          this.leftSpace();
        }
      },
      enteredSpace() {
        self.isInSpace = true;
      },
      leftSpace() {
        self.isInSpace = false;
        self.isPausedInSpace = false;
      }
    }))
);

export {MusicPlayerStore};
