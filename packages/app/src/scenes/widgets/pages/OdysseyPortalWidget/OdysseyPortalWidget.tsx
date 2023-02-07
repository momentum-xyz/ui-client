import React, {FC, useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import {Dialog} from '@momentum-xyz/ui-kit';

import {OdysseyInfo} from 'ui-kit/molecules/OdysseyInfo';
import {useNavigation, useStore} from 'shared/hooks';

const MENU_OFFSET_LEFT = 10;
const MENU_OFFSET_TOP = 20;

interface PropsInterface {}

const OdysseyPortalWidget: FC<PropsInterface> = () => {
  const {sessionStore, widgetsStore, nftStore} = useStore();
  const {odysseyPortalStore} = widgetsStore;

  const {odyssey} = odysseyPortalStore;
  const alreadyConnected = nftStore.isAlreadyConnected(odyssey?.owner || '');

  const {goToOdysseyHome} = useNavigation();

  const handleConnect = () => {
    if (odyssey) {
      nftStore.setConnectToNftItemId(odyssey.id);
    }
  };

  const handleTeleport = useCallback(() => {
    goToOdysseyHome(odyssey?.uuid || '');
  }, [goToOdysseyHome, odyssey?.uuid]);

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
      onClose={odysseyPortalStore.resetModel}
      showCloseButton
    >
      <div data-testid="OdysseyPortalWidget-test">
        {odyssey && (
          <OdysseyInfo
            user={odysseyPortalStore.nftUser}
            odyssey={odysseyPortalStore.odyssey}
            alreadyConnected={alreadyConnected}
            onVisit={handleTeleport}
            onConnect={handleConnect}
            connectDisabled={alreadyConnected || sessionStore.isGuest}
          />
        )}
      </div>
    </Dialog>
  );
};

export default observer(OdysseyPortalWidget);
