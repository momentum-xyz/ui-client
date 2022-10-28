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
  const {dashboardStore, spaceStore} = collaborationStore;

  switch (tile.type) {
    case TileTypeEnum.TILE_TYPE_MEDIA:
      dashboardStore.setImageUrl(tile);
      return (
        <TileDetail
          tile={tile}
          imageUrl={dashboardStore.imageUrl}
          provided={provided}
          isAdmin={spaceStore?.isAdmin ?? false}
          isMember={spaceStore?.isMember ?? false}
        />
      );
    case TileTypeEnum.TILE_TYPE_TEXT:
      return (
        <TileDetail
          tile={tile}
          provided={provided}
          isAdmin={spaceStore?.isAdmin ?? false}
          isMember={spaceStore?.isMember ?? false}
        />
      );
    case TileTypeEnum.TILE_TYPE_VIDEO:
      dashboardStore.setVideoUrl(tile);
      return (
        <TileDetail
          tile={tile}
          videoUrl={dashboardStore.videoUrl}
          provided={provided}
          isAdmin={spaceStore?.isAdmin ?? false}
          isMember={spaceStore?.isMember ?? false}
        />
      );
    default:
      return null;
  }
};

export default memo(TileItem);
