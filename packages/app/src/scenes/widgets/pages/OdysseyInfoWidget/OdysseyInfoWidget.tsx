import React, {FC, useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import {Dialog} from '@momentum-xyz/ui-kit';
import {generatePath, useHistory} from 'react-router-dom';

import {OdysseyInfo} from 'ui-kit/molecules/OdysseyInfo';
import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';

const MENU_OFFSET_LEFT = 10;
const MENU_OFFSET_TOP = 20;

const OdysseyInfoWidget: FC = () => {
  const {authStore, nftStore, widgetsStore} = useStore();
  const {odysseyInfoStore} = widgetsStore;
  const {odyssey} = odysseyInfoStore;

  const history = useHistory();

  const alreadyConnected = nftStore.isAlreadyConnected(odyssey?.owner || '');

  const handleTeleport = useCallback(() => {
    history.push(generatePath(ROUTES.odyssey.base, {worldId: odyssey?.uuid || ''}));
  }, [history, odyssey]);

  const handleConnect = useCallback(() => {
    if (odyssey) {
      nftStore.setConnectToNftItemId(odyssey.id);
    }
  }, [odyssey, nftStore]);

  return (
    <Dialog
      position="leftTop"
      title={odyssey?.name || ''}
      offset={{left: MENU_OFFSET_LEFT, top: MENU_OFFSET_TOP}}
      showBackground={false}
      headerStyle="uppercase"
      headerType="h1"
      hasBottomPadding={false}
      shortTopPadding
      layoutSize={{width: '315px'}}
      onClose={odysseyInfoStore.widget.close}
      showCloseButton
    >
      <>
        {odyssey && (
          <OdysseyInfo
            odyssey={odyssey}
            onVisit={handleTeleport}
            onConnect={handleConnect}
            connectDisabled={odyssey?.owner === authStore.wallet || alreadyConnected}
            onDock={() => {}}
            dockDisabled={true}
          />
        )}
      </>
    </Dialog>
  );
};

export default observer(OdysseyInfoWidget);
