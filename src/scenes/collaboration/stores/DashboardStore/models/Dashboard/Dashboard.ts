import {cast, flow, types} from 'mobx-state-tree';
import {DropResult} from 'react-beautiful-dnd';

import {RequestModel, ResetModel, TileListInterface, TileList, TileInterface} from 'core/models';
import {api} from 'api';
import {PermanentType} from 'core/enums';
import {appVariables} from 'api/constants';
import {youtubeVideoPath} from 'core/utils';

const Dashboard = types.compose(
  ResetModel,
  types
    .model('Dashboard', {
      updateRequest: types.optional(RequestModel, {}),
      request: types.optional(RequestModel, {}),
      tileList: types.optional(TileList, {}),
      dashboardIsEdited: true,
      imageUrl: types.maybe(types.string),
      videoUrl: types.maybe(types.string)
    })
    .actions((self) => ({
      fetchDashboard: flow(function* fetchDashboard(spaceId: string) {
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
              (tile.permanentType === PermanentType.POSTER ||
                tile.permanentType === PermanentType.MEME ||
                tile.permanentType === PermanentType.DESCRIPTION ||
                tile.permanentType === PermanentType.VIDEO)
            ) {
              self.dashboardIsEdited = false;
            }
          });
        }
      }),
      updatePositions: flow(function* updatePositions(tiles: TileInterface[]) {
        yield self.updateRequest.send(api.dashboardRepository.updateDashboardPositions, {
          data: {...self.tileList, tiles: tiles}
        });
      }),
      setImageUrl(tile: TileInterface) {
        self.imageUrl = `${appVariables.RENDER_SERVICE_URL}/get/${
          tile.permanentType === PermanentType.VIDEO ? tile.content?.url : tile.hash
        }`;
      },
      setVideoUrl(tile: TileInterface) {
        self.videoUrl = `https://www.youtube.com/embed/${youtubeVideoPath(
          tile.content?.url ?? '',
          tile.id
        )}`;
      },
      setTilesWithPositions(tiles: TileInterface[][]) {
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
      },
      onDragEnd({source, destination}: DropResult) {
        if (!destination) {
          return;
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
        } else {
          const sourceClone = Array.from(self.tileList.tileMatrix[sourceId]);
          const destClone = Array.from(self.tileList.tileMatrix[destinationId]);
          const [removed] = sourceClone.splice(source.index, 1);

          destClone.splice(destination.index, 0, removed);
          const final = self.tileList.tileMatrix.map((column, id) =>
            id === sourceId ? sourceClone : id === destinationId ? destClone : column
          );
          this.setTilesWithPositions(final);
        }
      }
    }))
);

export {Dashboard};
