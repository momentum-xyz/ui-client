import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {DraggableProvided} from 'react-beautiful-dnd';

import {TileInterface} from 'core/models';
import {PermanentType, TileType} from 'core/enums';

import NonEditTile from '../../../../../../../../../component/atoms/dashboard/NonEditTile';
import {appVariables} from '../../../../../../../../../api/constants';
import ImageTile from '../../../../../../../../../component/atoms/dashboard/ImageTile';
import EditPanelMenu from '../../../../../../../../../component/atoms/dashboard/EditPanelMenu';
import SimpleTile from '../../../../../../../../../component/atoms/dashboard/SimpleTile';
import VideoTile from '../../../../../../../../../component/atoms/dashboard/VideoTile';

export interface PropsInterface {
  tile: TileInterface;
  editable?: boolean;
  editTile?: (id: string) => void;
  deleteTile?: (id: string) => void;
  provided?: DraggableProvided;
}

const TileItem: FC<PropsInterface> = ({tile, editable = false, editTile, deleteTile, provided}) => {
  switch (tile.type) {
    case TileType.TILE_TYPE_MEDIA:
      if (
        (tile.permanentType === PermanentType.POSTER ||
          tile.permanentType === PermanentType.MEME) &&
        !tile.edited &&
        editable
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
        const url = `${appVariables.RENDER_SERVICE_URL}/get/${
          tile.permanentType === PermanentType.VIDEO ? tile.content?.url : tile.hash
        }`;

        return (
          <ImageTile key={tile.id} id={tile.id} url={url}>
            {editable && (
              <EditPanelMenu
                id={tile.id}
                permanentType={tile.permanentType}
                editTile={editTile}
                deleteTile={deleteTile}
                provided={provided}
              />
            )}
          </ImageTile>
        );
      }
    case TileType.TILE_TYPE_TEXT:
      return (
        <SimpleTile key={tile.id} title={tile.content?.title ?? ''} text={tile.content?.text ?? ''}>
          {editable && (
            <EditPanelMenu
              id={tile.id}
              permanentType={tile.permanentType}
              editTile={editTile}
              deleteTile={deleteTile}
              provided={provided}
            />
          )}
        </SimpleTile>
      );
    case TileType.TILE_TYPE_VIDEO:
      return (
        <VideoTile key={tile.id} id={tile.id} url={tile.content?.url ?? ''}>
          {editable && (
            <EditPanelMenu
              id={tile.id}
              permanentType={tile.permanentType}
              editTile={editTile}
              deleteTile={deleteTile}
              provided={provided}
            />
          )}
        </VideoTile>
      );
    default:
      return null;
  }
};

export default observer(TileItem);
