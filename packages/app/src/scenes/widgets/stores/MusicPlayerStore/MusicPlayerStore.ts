import {types} from 'mobx-state-tree';
import {ResetModel} from '@momentum/sdk';

import {DialogModel} from 'core/models';

import {MusicPlayer, Playlist} from './models';

const MusicPlayerStore = types.compose(
  ResetModel,
  types
    .model('MusicPlayerStore', {
      musicPlayerWidget: types.optional(DialogModel, {}),
      playlist: types.optional(Playlist, {}),
      musicPlayer: types.optional(MusicPlayer, {})
    })
    .actions((self) => ({
      init(worldId: string): void {
        self.playlist.fetchPlaylist(worldId);
      },
      togglePlayback(): void {
        if (self.playlist.tracks.length < 1) {
          return;
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
      }
    }))
);

export {MusicPlayerStore};
