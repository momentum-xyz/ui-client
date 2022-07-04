import React, {FC, memo} from 'react';
import {DraggableProvided} from 'react-beautiful-dnd';

// import {TileInterface} from 'core/models';
import {PermanentType, TileType} from 'core/enums';
import {useStore} from 'shared/hooks';

import NonEditTile from '../../../../../../../../../component/atoms/dashboard/NonEditTile';

import {TileDetail} from './components';

export interface PropsInterface {
  tile: any;
  editTile?: (id: string) => void;
  deleteTile?: (id: string) => void;
  provided?: DraggableProvided;
}

const TileItem: FC<PropsInterface> = ({tile, editTile, deleteTile, provided}) => {
  const {
    collaborationStore: {spaceStore, dashboardStore}
  } = useStore();

  switch (tile.type) {
    case TileType.TILE_TYPE_MEDIA:
      if (
        (tile.permanentType === PermanentType.POSTER ||
          tile.permanentType === PermanentType.MEME) &&
        !tile.edited &&
        (spaceStore.isAdmin || spaceStore.isMember)
      ) {
        return (
          <NonEditTile
            key={tile.id}
            id={tile.id}
            editTile={editTile}
            permanentType={tile.permanentType}
          />
        );
      } else {
        dashboardStore.setImageUrl(tile);
        return <TileDetail tile={tile} imageUrl={dashboardStore.imageUrl} provided={provided} />;
      }
    case TileType.TILE_TYPE_TEXT:
      return <TileDetail tile={tile} provided={provided} />;
    case TileType.TILE_TYPE_VIDEO:
      dashboardStore.setVideoUrl(tile);
      return <TileDetail tile={tile} videoUrl={dashboardStore.videoUrl} provided={provided} />;
    default:
      return null;
  }
};

export default memo(TileItem);
