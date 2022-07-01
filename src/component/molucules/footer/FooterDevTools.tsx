import React, {useRef} from 'react';
import {v4 as uuidv4} from 'uuid';

import {useStore} from 'shared/hooks';
import {PosBusService} from 'shared/services';
import {ToolbarIcon, ToolbarIconList} from 'ui-kit';

import {UnityDevPopup} from '../../popup/UnityDevPopup';
import Modal, {ModalRef} from '../../util/Modal';
import {usePostSpace} from '../../../hooks/api/useSpaceService';
import {SpaceDTO, SpaceType} from '../../../context/type/Space';

const FooterDevTools: React.FC = () => {
  const [postSpace] = usePostSpace();
  const {worldStore} = useStore().mainStore;
  const unityModal = useRef<ModalRef>(null);

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
    PosBusService.sendHighFive('e4eec468-50c5-4749-b4a4-096b803269cb');
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
