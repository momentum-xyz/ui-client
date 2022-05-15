import React, {useCallback, useRef, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {toast} from 'react-toastify';
import {t} from 'i18next';

import {request} from 'api/request';
import {ToastContent, TOAST_COMMON_OPTIONS} from 'ui-kit';

import Panel, {PanelBody, PanelTitle} from '../../../component/atoms/Panel';
import Modal, {ModalRef} from '../../../component/util/Modal';
import {AddSpacePopup} from '../popups/AddSpacePopup';
import TopbarButton from '../../../component/atoms/topbar/TopbarButton';
import {ReactComponent as PencilIcon} from '../../../images/icons/pencil.svg';
import {ReactComponent as TrashIcon} from '../../../images/icons/trash.svg';
import {useConfirmationDialog} from '../../../hooks/useConformationDialog';
import {Space, SpaceDTO} from '../../../context/type/Space';
import {usePostSpace} from '../../../hooks/api/useSpaceService';
import {bytesToUuid} from '../../../core/utils/uuid.utils';
import {DeleteSpacePopup} from '../popups/DeleteSpacePopup';

export interface SpacesPanelViewProps {
  space: Space;
  subspaces: Space[];
  allowedSubspaces: string[];
  // eslint-disable-next-line react/no-unused-prop-types
  parentType: string;
  onUpdate: () => void;
}

export const SpacesPanelView: React.FC<SpacesPanelViewProps> = ({
  space,
  subspaces,
  allowedSubspaces,
  onUpdate
}) => {
  const [spaceToBeDelete, setSpaceToBeDelete] = useState<Space | undefined>();
  const addSpaceModal = useRef<ModalRef>(null);
  const deleteSpaceModal = useRef<ModalRef>(null);
  const history = useHistory();

  const {getConfirmation} = useConfirmationDialog();

  const [postSpace] = usePostSpace();

  const deleteSpace = async (id: string) => {
    try {
      await request.delete(window._env_.BACKEND_ENDPOINT_URL + `/space/delete/${id}`);
    } catch (err) {
      toast.error(
        <ToastContent
          isDanger
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('messages.subSpaceDeleteFailure')}
          isCloseButton
        />,
        TOAST_COMMON_OPTIONS
      );
    }
  };

  // @ts-ignore: TODO: Refactor
  const addSpace = (newSpace) => {
    const spaceDTO: SpaceDTO = {
      parentId: bytesToUuid(space.id.data),
      root: false,
      visibility: true,
      name: newSpace.name,
      spaceType: newSpace.type
    };
    if (spaceDTO) {
      postSpace(spaceDTO)
        .then(() => onUpdate())
        .catch((error) => {
          console.error(error);
          toast.error(
            <ToastContent
              isDanger
              headerIconName="alert"
              title={t('titles.alert')}
              text={t('messages.subSpaceCreateFailure')}
              isCloseButton
            />,
            TOAST_COMMON_OPTIONS
          );
        });
      addSpaceModal.current?.close();
    }
  };

  const confirmDeleteSpace = useCallback(
    (item) => {
      getConfirmation({
        blockInterface: true,
        title: 'Delete space',
        message: 'Are you sure you want to delete this space?',
        confirmButton: 'Yes, delete',
        cancelButton: 'No, cancel'
      }).then((result) => {
        if (result) {
          //checks if parent is universe or world to enable extra safety. Subspaces with parent type program can be deleted without extra safety.
          //Ideal it would be to check on the type of the item itself, but subspaces don't get the type yet from the api call.
          if (
            space.spaceType?.name.toLowerCase() === 'Universe' ||
            space.spaceType?.name.toLowerCase() === 'world'
          ) {
            //extra safety check
            setSpaceToBeDelete(item);
            deleteSpaceModal.current?.open();
          } else {
            deleteSpace(bytesToUuid(item.id.data)).then(onUpdate);
          }
        }
      });
    },
    [getConfirmation]
  );

  // @ts-ignore: TODO: Refactor
  const extraCheckValid = (spaceToDelete) => {
    deleteSpaceModal.current?.close();
    deleteSpace(bytesToUuid(spaceToDelete.id.data)).then(onUpdate);
  };

  const editSpace = (id: string) => {
    // const tile = internalTiles.flat().find((tile) => tile.id === id);
    // setEditingTile(tile || null);
    history.replace({pathname: '/space/' + id + '/admin'});
  };

  const subSpaceslist = () => {
    const rows = subspaces.map((item, i) => (
      <div
        className="w-full flex items-start justify-between p-1.5 border-b-1 mb-1 border-black-50"
        key={i}
      >
        <div className="flex-1 truncate">
          <h3 className="text-prime-blue-100 text-base font-bold font-sans truncate">
            {item.name}
          </h3>
          {/*<p className="mt-1 text-white-1000 text-base font-sans font-medium truncate">space type</p>*/}
        </div>
        <div className="flex">
          <TopbarButton title="Edit Space" onClick={() => editSpace(bytesToUuid(item.id.data))}>
            <PencilIcon className="text-prime-blue-100" />
          </TopbarButton>
          <TopbarButton title="Delete Space" onClick={() => confirmDeleteSpace(item)}>
            <TrashIcon className="text-prime-blue-100" />
          </TopbarButton>
        </div>
      </div>
    ));

    return rows;
  };
  return (
    <>
      <Panel>
        <PanelTitle onAddAction={() => addSpaceModal.current?.open()} addLabel="Add Space">
          Subspaces
        </PanelTitle>
        <PanelBody scroll={true}>{subSpaceslist()}</PanelBody>
      </Panel>
      <Modal ref={addSpaceModal}>
        <AddSpacePopup
          spaceName={space?.name}
          allowedSubspaces={allowedSubspaces}
          onClose={() => addSpaceModal.current?.close()}
          onSave={addSpace}
        />
      </Modal>
      {spaceToBeDelete && (
        <Modal ref={deleteSpaceModal}>
          <DeleteSpacePopup
            space={spaceToBeDelete}
            onClose={() => deleteSpaceModal.current?.close()}
            onSave={extraCheckValid}
          />
        </Modal>
      )}
    </>
  );
};
