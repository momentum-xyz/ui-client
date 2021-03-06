import {cast, flow, types} from 'mobx-state-tree';
import {t} from 'i18next';

import {api, PlaylistResponse} from 'api';
import {TrackModel, RequestModel} from 'core/models';
import {appVariables} from 'api/constants';

const Playlist = types
  .model('Playlist', {
    request: types.optional(RequestModel, {}),
    tracks: types.optional(types.array(TrackModel), []),
    currentSrcIndex: types.optional(types.number, 0),
    currentTrackHash: types.optional(types.string, ''),
    currentTrackName: types.optional(types.string, t('musicPlayer.noTrackTitle'))
  })
  .actions((self) => ({
    setCurrentTrackHash(): void {
      if (self.tracks.length < 1) {
        return;
      }
      self.currentTrackHash = `${appVariables.RENDER_SERVICE_URL}/track/${
        self.tracks[self.currentSrcIndex].trackHash
      }`;
    },
    setCurrentTrackName(): void {
      if (self.tracks.length < 1) {
        self.currentTrackName = t('musicPlayer.noTrackTitle');
        return;
      }
      self.currentTrackName = self.tracks[self.currentSrcIndex].name;
    },
    next() {
      self.currentSrcIndex = self.currentSrcIndex + 1;
      this.setCurrentTrackHash();
      this.setCurrentTrackName();
    },
    previous() {
      self.currentSrcIndex = self.currentSrcIndex - 1;
      this.setCurrentTrackHash();
      this.setCurrentTrackName();
    },
    first() {
      self.currentSrcIndex = 0;
      this.setCurrentTrackHash();
      this.setCurrentTrackName();
    }
  }))
  .actions((self) => ({
    fetchPlaylist: flow(function* (worldId: string) {
      const response: PlaylistResponse = yield self.request.send(
        api.playlistRepository.fetchPlaylist,
        {
          worldId
        }
      );
      if (response) {
        self.tracks = cast(
          response.map((track) => ({
            trackHash: track.track.file_hash,
            name: track.track.name
          }))
        );
        self.setCurrentTrackHash();
        self.setCurrentTrackName();
      }
    })
  }));
export {Playlist};
