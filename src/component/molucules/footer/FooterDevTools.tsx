import React, {useRef} from 'react';
import {v4 as uuidv4} from 'uuid';

import {ToolbarIcon, ToolbarIconList} from 'ui-kit';

import {UnityDevPopup} from '../../popup/UnityDevPopup';
import Modal, {ModalRef} from '../../util/Modal';
import WebsocketService from '../../../context/Websocket/WebsocketService';
import {useStore} from '../../../shared/hooks';
import {usePostSpace} from '../../../hooks/api/useSpaceService';
import {SpaceDTO, SpaceType} from '../../../context/type/Space';

const FooterDevTools: React.FC = () => {
  // useJoinCollaborationSpaceByAssign();
  // const createTable = useCreateCollaborationTable();
  const [postSpace] = usePostSpace();
  const {worldStore} = useStore().mainStore;
  const unityModal = useRef<ModalRef>(null);
  // const {collaborationState} = useCollaboration();

  const {widgetStore} = useStore();
  const {stakingStore} = widgetStore;
  const {stakingDialog} = stakingStore;

  const testFunction = async () => {
    const spaceDTO: SpaceDTO = {
      worldId: worldStore.worldId,
      root: false,
      visibility: true,
      name: uuidv4(),
      spaceType: SpaceType.GRAB_A_TABLE
    };
    await postSpace(spaceDTO);
  };

  const highFive = () => {
    WebsocketService.sendHighFive('e4eec468-50c5-4749-b4a4-096b803269cb')
      .then(console.info)
      .catch(console.error);
  };

  const createTable = async () => {
    const spaceDTO: SpaceDTO = {
      worldId: worldStore.worldId,
      root: false,
      visibility: true,
      name: uuidv4(),
      spaceType: SpaceType.GRAB_A_TABLE
    };
    await postSpace(spaceDTO);
  };

  // const inviteToTable = async () => {
  //   if (collaborationState.collaborationTable) {
  //     await inviteChannel(collaborationState.collaborationTable.id, [
  //       'e4eec468-50c5-4749-b4a4-096b803269cb'
  //     ]);
  //   } else {
  //     await createTable();
  //     // if (channel) await inviteChannel(channel.id, ['e4eec468-50c5-4749-b4a4-096b803269cb']);
  //   }
  // };

  const openStaking = () => {
    console.info('openstaking');
    stakingDialog.open();
  };

  return (
    <>
      <ToolbarIconList>
        <div>DEV:</div>
        <ToolbarIcon icon="collaboration" title="Danger!" onClick={testFunction} />
        <ToolbarIcon icon="collaboration" title="Grab a Table" onClick={createTable} />
        <ToolbarIcon icon="collaboration" title="Give a high five" onClick={highFive} />
        <ToolbarIcon icon="collaboration" title="Open stacking" onClick={openStaking} />
        <ToolbarIcon icon="unity" title="Unity Dev tools" onClick={unityModal.current?.open} />
      </ToolbarIconList>
      <Modal ref={unityModal} backdrop={false}>
        <UnityDevPopup onClose={unityModal.current?.close} />
      </Modal>
    </>
  );
};

export default FooterDevTools;
