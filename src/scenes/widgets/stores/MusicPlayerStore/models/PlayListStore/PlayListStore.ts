import {cast, flow, types} from 'mobx-state-tree';

import {api, PlaylistResponse} from 'api';
import {TrackModel, RequestModel} from 'core/models';

const PlayListStore = types
  .model('PlayListStore', {
    request: types.optional(RequestModel, {}),
    tracks: types.optional(types.array(TrackModel), []),
    id: types.maybeNull(types.string),
    address: types.maybeNull(types.string)
  })
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
      }
    })
  }));
export {PlayListStore};
