import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';

import {useStore} from 'shared/hooks';
import {COLUMNS} from 'core/constants';

import {TileItem} from './components/TileItem';
import * as styled from './Dashboard.styled';

const Dashboard: FC = () => {
  const {
    collaborationStore: {dashboardStore, spaceStore}
  } = useStore();

  useEffect(() => {
    if (spaceStore.space.id) {
      dashboardStore.fetchDashboard(spaceStore.space.id);
    }
    return () => {
      dashboardStore.resetModel();
    };
  }, []);

  useEffect(() => {}, [dashboardStore.tileList.tileMatrix]);

  return (
    <styled.CoreContainer>
      <DragDropContext onDragEnd={dashboardStore.onDragEnd}>
        {COLUMNS.map((column, index) => (
          <Droppable key={index} droppableId={index.toString()}>
            {(provided, snapshot) => (
              <div className="flex-1 flex flex-col gap-1">
                {column}
                <div className="h-full flex flex-col gap-1" ref={provided.innerRef}>
                  {dashboardStore.tileList.tileMatrix[index].map((tile, index) => (
                    <Draggable key={tile.id} draggableId={tile.id ?? ''} index={index}>
                      {(provided, _) => (
                        <div ref={provided.innerRef} {...provided.draggableProps}>
                          <TileItem tile={tile} provided={provided} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </styled.CoreContainer>
  );
};

export default observer(Dashboard);
