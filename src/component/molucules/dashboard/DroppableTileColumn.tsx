import React from 'react';
import {Draggable, Droppable} from 'react-beautiful-dnd';

import {Tile} from '../../../hooks/api/useDashboardService';
import TileElement from '../../atoms/dashboard/TileElement';

export interface DroppableTileColumnProps {
  id: string;
  tiles: Tile[];
  children?: React.ReactNode;
  canEdit?: boolean;
  editTile: (id: string) => void;
  deleteTile: (id: string) => void;
}

const DroppableTileColumn: React.FC<DroppableTileColumnProps> = ({
  id,
  tiles,
  editTile,
  deleteTile,
  canEdit,
  children
}: DroppableTileColumnProps) => (
  <Droppable droppableId={id}>
    {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
    {(provided, snapshot) => (
      <div className="flex-1 flex flex-col gap-1">
        {children}
        <div className="h-full flex flex-col" ref={provided.innerRef}>
          {tiles.map((tile, index) => (
            <Draggable key={tile.id} draggableId={tile.id} index={index}>
              {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
              {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.draggableProps}>
                  <TileElement
                    key={tile.id}
                    tile={tile}
                    editable={canEdit}
                    editTile={editTile}
                    deleteTile={deleteTile}
                    provided={provided}
                  />
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      </div>
    )}
  </Droppable>
);

export default DroppableTileColumn;
