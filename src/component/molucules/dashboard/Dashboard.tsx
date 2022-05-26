import React, {ReactNode, useCallback, useRef, useState} from 'react';
import {DragDropContext, Draggable, Droppable, DropResult} from 'react-beautiful-dnd';

import {request} from 'api/request';
import {useDebouncedEffect} from 'ui-kit/hooks';

import {Dashboard, Tile} from '../../../hooks/api/useDashboardService';
import {useConfirmationDialog} from '../../../hooks/useConformationDialog';
import TileElement from '../../atoms/dashboard/TileElement';
import {TileEditPopup} from '../../popup/dashboard/TileEditPopup';
import {TilePopup} from '../../popup/dashboard/TilePopup';
import Modal, {ModalRef} from '../../util/Modal';
import {useDashboardManager} from '../../../hooks/dashboard/useDashboard';
import {Space, SpaceType} from '../../../context/type/Space';
import {ReactComponent as Loader} from '../../../images/odyssey-stamp.svg';
import {appVariables} from '../../../api/constants';

export interface DashboardProps {
  dashboard: Dashboard | undefined;
  space: Space | undefined;
  spaceType: SpaceType | undefined;
  staticElements: ReactNode[];
  editing?: boolean;
  onRearrange?: (dashboardLayout: any) => void;
  refetch: () => void;
}

export interface DashboardHandle {
  addTile: () => void;
}

export type DashboardRef = React.ElementRef<typeof DashboardDynamicView>;

const DashboardDynamicView = React.forwardRef<DashboardHandle, DashboardProps>(
  ({dashboard, space, spaceType, staticElements, editing = false, onRearrange, refetch}, ref) => {
    const {getConfirmation} = useConfirmationDialog();
    const [editingTile, setEditingTile] = useState<Tile | null>(null);
    const [isSavingTile, setIsSavingTile] = useState(false);
    // const [deleteMedia] = useDeleteMedia(dashboard?.owner_id);

    const createModal = useRef<ModalRef>(null);
    const editModal = useRef<ModalRef>(null);

    const {internalTiles, setInternalTiles, saveDashboard, saveTile} = useDashboardManager(
      //@ts-ignore
      dashboard,
      staticElements.length,
      space
    );

    const onDragEnd = useCallback(
      ({source, destination}: DropResult) => {
        // dropped outside the list
        if (!destination) {
          return;
        }

        const sourceId = parseInt(source.droppableId);
        const destinationId = parseInt(destination.droppableId);

        if (sourceId === destinationId) {
          const result = Array.from(internalTiles[sourceId]);
          const [removed] = result.splice(source.index, 1);
          result.splice(destination.index, 0, removed);
          setInternalTiles((tiles) => {
            const final = tiles.map((column, id) => (id === sourceId ? result : column));
            if (onRearrange) {
              onRearrange(final);
            }
            return final;
          });
        } else {
          const sourceClone = Array.from(internalTiles[sourceId]);
          const destClone = Array.from(internalTiles[destinationId]);
          const [removed] = sourceClone.splice(source.index, 1);

          destClone.splice(destination.index, 0, removed);
          setInternalTiles((tiles) => {
            const final = tiles.map((column, id) =>
              id === sourceId ? sourceClone : id === destinationId ? destClone : column
            );
            if (onRearrange) {
              onRearrange(final);
            }
            return final;
          });
        }
      },
      [internalTiles, onRearrange]
    );

    const isFirstRun = useRef(true);
    useDebouncedEffect(
      () => {
        if (isFirstRun.current) {
          isFirstRun.current = false;
          return;
        }
        saveDashboard();
      },
      500,
      [internalTiles]
    );

    const deleteTile = useCallback(
      (id: string) => {
        getConfirmation({
          title: 'Delete tile',
          message: 'Are you sure you want to delete this tile',
          confirmButton: 'Yes',
          cancelButton: 'No'
        }).then(async (result) => {
          if (result) {
            const response = await request.post(
              appVariables.BACKEND_ENDPOINT_URL + `/dashboard/delete/${id}`,
              {}
            );

            if (response) {
              setInternalTiles((tiles) =>
                tiles.map((column) => column.filter((tile) => tile.id !== id))
              );
            }
          }
        });
      },
      [getConfirmation]
    );

    // @ts-ignore
    const showEditModal = (id) => {
      const tile = internalTiles.flat().find((tile) => tile.id === id);
      setEditingTile(tile || null);
      editModal.current?.open();
    };

    const showNewTileModal = () => {
      setEditingTile(null);
      createModal.current?.open();
    };

    React.useImperativeHandle(ref, () => {
      return {addTile: showNewTileModal};
    });

    return (
      <div className="h-dashboard-container w-full overflow-y-auto scroll-hidden">
        {isSavingTile && (
          <div className="z-pop-over">
            <div className="absolute inset-0 bg-dark-blue-50 z-pop-over" />
            <Loader className="w-6 h-6 animate-spin fixed top-1/2 left-1/2" viewBox="0 0 180 180" />
          </div>
        )}
        <div className="pb-10">
          <Modal ref={editModal}>
            {editingTile && (
              <TileEditPopup
                onClose={() => editModal.current?.close()}
                onSave={(tile, file) => {
                  createModal.current?.close();
                  editModal.current?.close();
                  setIsSavingTile(true);
                  saveTile(tile, file, 'edit').then(() => {
                    setIsSavingTile(false);
                    refetch();
                  });
                }}
                tile={editingTile}
                dashboard={dashboard}
              />
            )}
          </Modal>

          <Modal ref={createModal}>
            <TilePopup
              onClose={() => createModal.current?.close()}
              onSave={(tile, file) => {
                createModal.current?.close();
                editModal.current?.close();
                setIsSavingTile(true);
                saveTile(tile, file, 'create').then(() => {
                  setIsSavingTile(false);
                  refetch();
                });
              }}
              dashboard={dashboard}
              spaceType={spaceType}
            />
          </Modal>
          <div className="w-full h-full flex items-stretch gap-1">
            {editing && (
              <DragDropContext onDragEnd={onDragEnd}>
                {staticElements.map((column, index) => (
                  // eslint-disable-next-line react/jsx-key
                  <Droppable droppableId={index.toString()}>
                    {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
                    {(provided, snapshot) => (
                      <div className="flex-1 flex flex-col gap-1">
                        {column}
                        <div className="h-full flex flex-col" ref={provided.innerRef}>
                          {internalTiles[index].map((tile, index) => (
                            <Draggable key={tile.id} draggableId={tile.id} index={index}>
                              {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
                              {(provided, _) => (
                                <div ref={provided.innerRef} {...provided.draggableProps}>
                                  <TileElement
                                    key={tile.id}
                                    tile={tile}
                                    editable={editing}
                                    editTile={showEditModal}
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
                ))}
              </DragDropContext>
            )}
            {!editing && (
              <>
                {staticElements.map((column, index) => (
                  // eslint-disable-next-line react/jsx-key
                  <div className="flex-1 flex flex-col gap-1">
                    {column}
                    <div className="h-full flex flex-col">
                      {internalTiles[index].map((tile) => (
                        <TileElement
                          key={tile.id}
                          tile={tile}
                          editable={editing}
                          editTile={showEditModal}
                          deleteTile={deleteTile}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default DashboardDynamicView;
