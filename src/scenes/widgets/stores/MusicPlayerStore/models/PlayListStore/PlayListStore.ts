import {cast, flow, types} from 'mobx-state-tree';

import {api, PlaylistResponse} from 'api';
import {TrackModel, RequestModel} from 'core/models';
import {appVariables} from 'api/constants';

const PlayListStore = types
  .model('PlayListStore', {
    request: types.optional(RequestModel, {}),
    tracks: types.optional(types.array(TrackModel), []),
    currentSrcIndex: types.optional(types.number, 0),
    currentTrackHash: types.optional(types.string, ''),
    currentTrackName: types.maybe(types.string)
  })
  .actions((self) => ({
    setCurrentTrackHash() {
      self.currentTrackHash = cast(
        appVariables.RENDER_SERVICE_URL + `/track/${self.tracks[self.currentSrcIndex].trackHash}`
      );
    },
    setCurrentTrackName() {
      self.currentTrackName = self.tracks[self.currentSrcIndex].name;
    }
  }))
  .actions((self) => ({
    fetchPlaylist: flow(function* (worldId: string) {
      const response: PlaylistResponse[] = yield self.request.send(
        api.playlistRepository.fetchPlaylist,
        {
          worldId
        }
      );

      if (response) {
        console.info(response);
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
  }))
  .actions((self) => ({
    next() {
      self.currentSrcIndex = self.currentSrcIndex + 1;
      self.setCurrentTrackHash();
      self.setCurrentTrackName();
    },
    previous() {
      self.currentSrcIndex = self.currentSrcIndex - 1;
      self.setCurrentTrackHash();
      self.setCurrentTrackName();
    },
    first() {
      self.currentSrcIndex = 0;
      self.setCurrentTrackHash();
      self.setCurrentTrackName();
    }
  }));
export {PlayListStore};
