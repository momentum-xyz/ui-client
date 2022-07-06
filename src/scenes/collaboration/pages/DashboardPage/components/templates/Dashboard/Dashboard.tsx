import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {DragDropContext, Draggable, Droppable, DropResult} from 'react-beautiful-dnd';

import {COLUMNS} from 'core/constants';
import {TileInterface} from 'core/models';

import {TileItem} from './components/TileItem';
import * as styled from './Dashboard.styled';

interface PropsInterface {
  tilesList: TileInterface[][];
  onDragEnd: ({source, destination}: DropResult) => void;
  canDrag: boolean;
}

const Dashboard: FC<PropsInterface> = ({tilesList, onDragEnd, canDrag}) => {
  return (
    <styled.Container>
      {canDrag && (
        <DragDropContext onDragEnd={onDragEnd}>
          {COLUMNS.map((column, index) => (
            <Droppable key={index} droppableId={index.toString()}>
              {(provided, snapshot) => (
                <styled.ColumnContainer>
                  {column}
                  <styled.RowContainer ref={provided.innerRef}>
                    {tilesList[index].map((tile, index) => (
                      <Draggable key={tile.id} draggableId={tile.id ?? ''} index={index}>
                        {(provided, _) => (
                          <div
                            style={provided.draggableProps.style}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            <TileItem tile={tile} provided={provided} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </styled.RowContainer>
                </styled.ColumnContainer>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      )}
      {!canDrag &&
        COLUMNS.map((column, index) => (
          <styled.ColumnContainer key={index}>
            {column}
            <styled.RowContainer>
              {tilesList[index].map((tile, index) => (
                <div key={index}>
                  <TileItem tile={tile} />
                </div>
              ))}
            </styled.RowContainer>
          </styled.ColumnContainer>
        ))}
    </styled.Container>
  );
};

export default observer(Dashboard);
