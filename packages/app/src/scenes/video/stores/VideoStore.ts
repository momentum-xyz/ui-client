import {flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {TileInterface, TileListInterface} from 'core/models';
import {VideoTypeEnum} from 'core/enums';
import {api} from 'api';
import {youtubeVideoHash} from 'core/utils';

const VideoStore = types
  .compose(
    ResetModel,
    types.model('VideoStore', {
      request: types.optional(RequestModel, {}),
      type: types.maybe(types.enumeration(Object.values(VideoTypeEnum))),
      dashboardId: types.maybe(types.string),
      youtubeHash: ''
    })
  )
  .actions((self) => ({
    fetchYoutubeHash: flow(function* (spaceId: string) {
      const response: TileListInterface = yield self.request.send(
        api.dashboardRepository.fetchDashboard,
        {
          spaceId
        }
      );
      if (response) {
        const videoItem: TileInterface | undefined = response.tiles.find(
          (item) => item.permanentType === 'video'
        );
        if (videoItem) {
          self.youtubeHash = youtubeVideoHash(videoItem?.content?.url ?? '', videoItem.id);
        }
      }
    })
  }));

export {VideoStore};
