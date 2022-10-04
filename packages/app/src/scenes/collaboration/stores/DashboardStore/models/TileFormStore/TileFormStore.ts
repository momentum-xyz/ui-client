import {flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum/core';

import {TileInterface} from 'core/models';
import {api, TextTileFormInterface, UploadTileImageResponse, VideoTileFormInterface} from 'api';
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
      createImageTile: flow(function* (spaceId: string, file: File) {
        const response: string = yield self.imageUploadRequest.send(
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
              // @ts-ignore TODO: Fix ts errors
              column: 0,
              row: 0,
              permanentType: null,
              type: TileTypeEnum.TILE_TYPE_MEDIA,
              internal: true,
              render: 1
            }
          });
          return self.tileCreateRequest.isDone;
        }

        return false;
      }),
      createTextTile: flow(function* (spaceId: string, data: TextTileFormInterface) {
        yield self.tileCreateRequest.send(api.dashboardRepository.createTile, {
          spaceId,
          data: {
            column: 0,
            row: 0,
            // @ts-ignore TODO: Fix ts errors
            content: {
              type: 'normal',
              title: data.text_title,
              text: data.text_description
            },
            permanentType: null,
            type: TileTypeEnum.TILE_TYPE_TEXT,
            internal: true,
            render: 0
          }
        });
        return self.tileCreateRequest.isDone;
      }),
      updateTextTile: flow(function* (tileId: string, data: TextTileFormInterface) {
        yield self.tileUpdateRequest.send(api.dashboardRepository.updateTile, {
          tileId,
          data: {
            ...self.currentTile,
            // @ts-ignore TODO: Fix ts errors
            content: {
              title: data.text_title,
              text: data.text_description
            }
          }
        });
        return self.tileUpdateRequest.isDone;
      }),
      createVideoTile: flow(function* (spaceId: string, data: VideoTileFormInterface) {
        yield self.tileCreateRequest.send(api.dashboardRepository.createTile, {
          spaceId,
          data: {
            column: 0,
            row: 0,
            // @ts-ignore TODO: Fix ts errors
            content: {
              type: 'normal',
              url: data.youtube_url
            },
            permanentType: null,
            type: TileTypeEnum.TILE_TYPE_VIDEO,
            internal: true,
            render: 1
          }
        });
        return self.tileCreateRequest.isDone;
      }),
      updateVideoTile: flow(function* (tileId: string, data: VideoTileFormInterface) {
        yield self.tileUpdateRequest.send(api.dashboardRepository.updateTile, {
          tileId,
          data: {
            ...self.currentTile,
            // @ts-ignore TODO: Fix ts errors
            content: {
              url: data.youtube_url
            }
          }
        });
        return self.tileUpdateRequest.isDone;
      }),
      updateImageTile: flow(function* (tileId: string, file: File) {
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
              // @ts-ignore TODO: Fix ts errors
              hash: hash
            }
          });
        }
        return self.tileUpdateRequest.isDone;
      }),
      deleteTile: flow(function* () {
        if (self.currentTile?.id) {
          yield self.tileDeleteRequest.send(api.dashboardRepository.deleteTile, {
            tileId: self.currentTile.id
          });
          return self.tileDeleteRequest.isDone;
        }

        return false;
      }),
      setTile(tile: TileInterface) {
        self.currentTile = tile;
      }
    }))
    .views((self) => ({
      get isLoading(): boolean {
        return (
          self.tileCreateRequest.isPending ||
          self.tileUpdateRequest.isPending ||
          self.imageUploadRequest.isPending
        );
      }
    }))
);

export {TileFormStore};
