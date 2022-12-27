import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Dialog} from '@momentum-xyz/ui-kit';

import {OdysseyInfo} from 'ui-kit/molecules/OdysseyInfo';
import {useStore} from 'shared/hooks';

const MENU_OFFSET_LEFT = 10;
const MENU_OFFSET_TOP = 20;

interface PropsInterface {}

const OdysseyBioWidget: FC<PropsInterface> = () => {
  const {sessionStore, widgetsStore, mainStore, nftStore} = useStore();
  const {odysseyBioStore} = widgetsStore;
  const {unityStore} = mainStore;

  const {odyssey} = odysseyBioStore;
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
      headerType="h1"
      hasBottomPadding={false}
      shortTopPadding
      layoutSize={{width: '285px'}}
      onClose={odysseyBioStore.resetModel}
      showCloseButton
    >
      <div data-testid="OdysseyBioWidget-test">
        {odyssey && (
          <OdysseyInfo
            user={odysseyBioStore.nftUser}
            odyssey={odysseyBioStore.odyssey}
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
      </div>
    </Dialog>
  );
};

export default observer(OdysseyBioWidget);
