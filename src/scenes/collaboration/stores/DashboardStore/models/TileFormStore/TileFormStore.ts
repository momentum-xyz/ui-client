import {flow, types} from 'mobx-state-tree';

import {RequestModel, ResetModel, TileInterface} from 'core/models';
import {api, TileFormInterface, UploadTileImageResponse} from 'api';
import {TileTypeEnum} from 'core/enums';

const TileFormStore = types.compose(
  ResetModel,
  types
    .model('TileFormStore', {
      tileFormRequest: types.optional(RequestModel, {}),
      imageUploadRequest: types.optional(RequestModel, {}),
      tile: types.maybeNull(types.frozen<TileInterface>())
    })
    .actions((self) => ({
      createTile: flow(function* (spaceId?: string, file?: File, data?: TileFormInterface) {
        if (data?.type === TileTypeEnum.TILE_TYPE_MEDIA) {
          const response: UploadTileImageResponse = yield self.imageUploadRequest.send(
            api.dashboardRepository.uploadTileImage,
            {
              file
            }
          );
          if (response && file) {
            const hash = response;
            yield self.tileFormRequest.send(api.dashboardRepository.createTile, {
              spaceId,
              data: {
                hash: hash,
                column: 0,
                row: 0,
                permanentType: null,
                type: TileTypeEnum.TILE_TYPE_MEDIA,
                internal: true,
                render: 1
              }
            });
          }
        } else {
          yield self.tileFormRequest.send(api.dashboardRepository.createTile, {
            spaceId,
            data: {
              column: 0,
              row: 0,
              content: {
                type: 'normal',
                title: data?.text_title,
                text: data?.text_description,
                url: data?.youtube_url
              },
              permanentType: null,
              type:
                data?.type === TileTypeEnum.TILE_TYPE_VIDEO
                  ? TileTypeEnum.TILE_TYPE_VIDEO
                  : TileTypeEnum.TILE_TYPE_TEXT,
              internal: true,
              render: data?.type === TileTypeEnum.TILE_TYPE_VIDEO ? 1 : 0
            }
          });
        }

        return self.tileFormRequest.isDone;
      }),
      deleteTile: flow(function* () {
        if (self.tile) {
          yield self.tileFormRequest.send(api.dashboardRepository.deleteTile, {
            tileId: self.tile.id
          });
        }
      }),
      setTile(tile: TileInterface) {
        self.tile = tile;
      }
    }))
);

export {TileFormStore};
