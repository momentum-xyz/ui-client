import React from 'react';
import {DraggableProvided} from 'react-beautiful-dnd';

import {appVariables} from 'api/constants';

import {PermanentType, Tile, TileType} from '../../../hooks/api/useDashboardService';

import EditPanelMenu from './EditPanelMenu';
import ImageTile from './ImageTile';
import SimpleTile from './SimpleTile';
import VideoTile from './VideoTile';
import NonEditTile from './NonEditTile';

export interface TileProps {
  tile: Tile;
  editable?: boolean;
  editTile?: (id: string) => void;
  deleteTile?: (id: string) => void;
  provided?: DraggableProvided;
}

const TileElement: React.FC<TileProps> = ({
  tile,
  editable = false,
  editTile,
  deleteTile,
  provided
}) => {
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
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          tile.permanentType === PermanentType.VIDEO ? tile.content.url : tile.hash
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
        <SimpleTile
          key={tile.id}
          icon="/icons/icon-help.svg"
          title={tile.content.title}
          text={tile.content.text}
        >
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
        <VideoTile key={tile.id} id={tile.id} url={tile.content.url}>
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

export default TileElement;
