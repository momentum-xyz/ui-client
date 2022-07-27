import {flow, types} from 'mobx-state-tree';

import {RequestModel, ResetModel, TileInterface} from 'core/models';
import {api, TileFormInterface, UploadTileImageResponse} from 'api';
import {TileTypeEnum} from 'core/enums';

const TileFormStore = types.compose(
  ResetModel,
  types
    .model('TileFormStore', {
      tileCreateRequest: types.optional(RequestModel, {}),
      tileUpdateRequest: types.optional(RequestModel, {}),
      tileDeleteRequest: types.optional(RequestModel, {}),
      imageUploadRequest: types.optional(RequestModel, {}),
      currentTile: types.maybeNull(types.frozen<TileInterface>())
    })
    .actions((self) => ({
      createImageTile: flow(function* (spaceId?: string, file?: File) {
        const response: UploadTileImageResponse = yield self.imageUploadRequest.send(
          api.resourcesRepository.uploadTileImage,
          {
            file
          }
        );
        if (response && file) {
          const hash = response;
          yield self.tileCreateRequest.send(api.dashboardRepository.createTile, {
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

        return self.tileCreateRequest.isDone;
      }),
      createTextOrVideoTile: flow(function* (spaceId?: string, data?: TileFormInterface) {
        yield self.tileCreateRequest.send(api.dashboardRepository.createTile, {
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
        return self.tileCreateRequest.isDone;
      }),
      updateImageTile: flow(function* (tileId?: string, file?: File) {
        const response: UploadTileImageResponse = yield self.imageUploadRequest.send(
          api.resourcesRepository.uploadTileImage,
          {
            file
          }
        );
        if (response && file) {
          const hash = response;
          yield self.tileUpdateRequest.send(api.dashboardRepository.updateTile, {
            tileId,
            data: {
              ...self.currentTile,
              hash: hash
            }
          });
        }
        return self.tileUpdateRequest.isDone;
      }),
      updateTextOrVideoTile: flow(function* (tileId?: string, data?: TileFormInterface) {
        yield self.tileUpdateRequest.send(api.dashboardRepository.updateTile, {
          tileId,
          data: {
            ...self.currentTile,
            content: {
              title: data?.text_title,
              text: data?.text_description,
              url: data?.youtube_url
            }
          }
        });
        return self.tileUpdateRequest.isDone;
      }),
      deleteTile: flow(function* () {
        if (self.currentTile) {
          yield self.tileDeleteRequest.send(api.dashboardRepository.deleteTile, {
            tileId: self.currentTile.id
          });
          return self.tileDeleteRequest.isDone;
        }
      }),
      setTile(tile: TileInterface) {
        self.currentTile = tile;
      }
    }))
);

export {TileFormStore};
