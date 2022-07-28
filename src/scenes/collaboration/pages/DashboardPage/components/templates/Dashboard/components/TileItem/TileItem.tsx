import React, {FC, memo} from 'react';
import {DraggableProvided} from 'react-beautiful-dnd';

import {TileTypeEnum} from 'core/enums';
import {useStore} from 'shared/hooks';
import {TileInterface} from 'core/models';

import {TileDetail} from './components';

export interface PropsInterface {
  tile: TileInterface;
  provided?: DraggableProvided;
}

const TileItem: FC<PropsInterface> = ({tile, provided}) => {
  const {collaborationStore} = useStore();
  const {dashboardStore, space} = collaborationStore;
  const {dashboard} = dashboardStore;

  switch (tile.type) {
    case TileTypeEnum.TILE_TYPE_MEDIA:
      dashboard.setImageUrl(tile);
      return (
        <TileDetail
          tile={tile}
          imageUrl={dashboard.imageUrl}
          provided={provided}
          isAdmin={space?.isAdmin ?? false}
          isMember={space?.isMember ?? false}
        />
      );
    case TileTypeEnum.TILE_TYPE_TEXT:
      return (
        <TileDetail
          tile={tile}
          provided={provided}
          isAdmin={space?.isAdmin ?? false}
          isMember={space?.isMember ?? false}
        />
      );
    case TileTypeEnum.TILE_TYPE_VIDEO:
      dashboard.setVideoUrl(tile);
      return (
        <TileDetail
          tile={tile}
          videoUrl={dashboard.videoUrl}
          provided={provided}
          isAdmin={space?.isAdmin ?? false}
          isMember={space?.isMember ?? false}
        />
      );
    default:
      return null;
  }
};

export default memo(TileItem);
