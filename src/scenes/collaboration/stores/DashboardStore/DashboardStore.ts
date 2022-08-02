import {cast, flow, types} from 'mobx-state-tree';
import {DropResult} from 'react-beautiful-dnd';

import {
  DialogModel,
  RequestModel,
  ResetModel,
  TileInterface,
  TileList,
  TileListInterface
} from 'core/models';
import {api} from 'api';
import {PermanentTypeEnum} from 'core/enums';
import {appVariables} from 'api/constants';
import {youtubeVideoFullPath} from 'core/utils';

import {TileFormStore} from './models/TileFormStore';
import {VibeStore} from './models/VibeStore';

const DashboardStore = types.compose(
  ResetModel,
  types
    .model('DashboardStore', {
      tileDialog: types.optional(DialogModel, {}),
      inviteToSpaceDialog: types.optional(DialogModel, {}),
      tileRemoveDialog: types.optional(DialogModel, {}),
      tileFormStore: types.optional(TileFormStore, {}),
      vibeStore: types.optional(VibeStore, {}),
      updateRequest: types.optional(RequestModel, {}),
      request: types.optional(RequestModel, {}),
      tileList: types.optional(TileList, {}),
      dashboardIsEdited: true,
      imageUrl: types.maybe(types.string),
      videoUrl: types.maybe(types.string)
    })
    .actions((self) => ({
      fetchDashboard: flow(function* (spaceId: string) {
        const response: TileListInterface = yield self.request.send(
          api.dashboardRepository.fetchDashboard,
          {
            spaceId
          }
        );
        if (response) {
          self.tileList = cast(response);
          response.tiles.map((tile) => {
            if (
              !tile.edited &&
              (tile.permanentType === PermanentTypeEnum.POSTER ||
                tile.permanentType === PermanentTypeEnum.MEME ||
                tile.permanentType === PermanentTypeEnum.DESCRIPTION ||
                tile.permanentType === PermanentTypeEnum.VIDEO)
            ) {
              self.dashboardIsEdited = false;
            }
          });
        }
      }),
      updatePositions: flow(function* (tiles: TileInterface[]) {
        yield self.updateRequest.send(api.dashboardRepository.updateDashboardPositions, {
          data: {...self.tileList, tiles: tiles}
        });
      }),
      setImageUrl(tile: TileInterface) {
        self.imageUrl = `${appVariables.RENDER_SERVICE_URL}/get/${
          tile.permanentType === PermanentTypeEnum.VIDEO ? tile.content?.url : tile.hash
        }`;
      },
      setVideoUrl(tile: TileInterface) {
        self.videoUrl = youtubeVideoFullPath(tile.content?.url ?? '', tile.id);
      },
      setTilesWithPositions(tiles: TileInterface[][]): TileInterface[] {
        const tilesWithPositions: TileInterface[] = tiles
          .map((col, colI) =>
            col.map((t, rowI) => ({
              ...t,
              column: colI,
              row: rowI,
              id: t.internal ? undefined : t.id
            }))
          )
          .flat();

        self.tileList.updateTiles(tilesWithPositions);
        this.updatePositions(tilesWithPositions);
        return tilesWithPositions;
      },
      onDragEnd({source, destination}: DropResult): TileInterface[][] {
        if (!destination) {
          return self.tileList.tileMatrix;
        }
        const sourceId = parseInt(source.droppableId);
        const destinationId = parseInt(destination.droppableId);

        if (sourceId === destinationId) {
          const result = Array.from(self.tileList.tileMatrix[sourceId]);
          const [removed] = result.splice(source.index, 1);

          result.splice(destination.index, 0, removed);
          const final = self.tileList.tileMatrix.map((column, id) =>
            id === sourceId ? result : column
          );
          this.setTilesWithPositions(final);
          return final;
        } else {
          const sourceClone = Array.from(self.tileList.tileMatrix[sourceId]);
          const destClone = Array.from(self.tileList.tileMatrix[destinationId]);
          const [removed] = sourceClone.splice(source.index, 1);

          destClone.splice(destination.index, 0, removed);
          const final = self.tileList.tileMatrix.map((column, id) =>
            id === sourceId ? sourceClone : id === destinationId ? destClone : column
          );
          this.setTilesWithPositions(final);
          return final;
        }
      }
    }))
);

export {DashboardStore};
