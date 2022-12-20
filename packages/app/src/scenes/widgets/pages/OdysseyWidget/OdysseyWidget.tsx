import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Dialog} from '@momentum-xyz/ui-kit';

import {OdysseyInfo} from 'ui-kit/molecules/OdysseyInfo';
import {useStore} from 'shared/hooks';

const MENU_OFFSET_LEFT = 10;
const MENU_OFFSET_TOP = 20;

interface PropsInterface {}

const OdysseyWidget: FC<PropsInterface> = () => {
  const {sessionStore, widgetsStore, mainStore, nftStore} = useStore();
  const {odysseyStore} = widgetsStore;
  const {unityStore} = mainStore;

  const {odyssey} = odysseyStore;
  const {userId} = sessionStore;
  const alreadyConnected = nftStore.isAlreadyConnected(odyssey?.owner || '');
  const userIsOdysseyOwner = userId === odyssey?.uuid;

  const handleConnect = () => {
    if (odyssey) {
      nftStore.setConnectToNftItemId(odyssey.id);
    }
  };

  const handleHighFive = () => {
    const userId = odyssey?.uuid;
    if (!userId) {
      return;
    }
    console.log(`Calling sendHighFive to ${userId} ...`);
    unityStore.sendHighFive(userId);
  };

  return (
    <Dialog
      position="leftTop"
      title={odyssey?.name}
      offset={{left: MENU_OFFSET_LEFT, top: MENU_OFFSET_TOP}}
      showBackground={false}
      headerStyle="uppercase"
      layoutSize={{width: '315px'}}
      onClose={odysseyStore.widget.close}
      showCloseButton
    >
      {odyssey && (
        <OdysseyInfo
          odyssey={odyssey}
          alreadyConnected={alreadyConnected}
          onVisit={() => {}}
          visitDisabled={true}
          onHighFive={handleHighFive}
          highFiveDisabled={userIsOdysseyOwner}
          onConnect={handleConnect}
          connectDisabled={userIsOdysseyOwner || alreadyConnected}
          onCoCreate={() => {}}
          coCreateDisabled={true}
        />
      )}
    </Dialog>
  );
};

export default observer(OdysseyWidget);
