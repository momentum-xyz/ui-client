import React, {FC, useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import {Dialog} from '@momentum-xyz/ui-kit';
import {generatePath, matchPath, useNavigate, useLocation} from 'react-router-dom';

import {OdysseyInfo} from 'ui-kit/molecules/OdysseyInfo';
import {useNavigation, useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';

const MENU_OFFSET_LEFT = 10;
const MENU_OFFSET_TOP = 20;

const WorldOverviewWidget: FC = () => {
  const {sessionStore, nftStore, widgetsStore, objectStore, universeStore} = useStore();
  const {odysseyInfoStore} = widgetsStore;
  const {odyssey, isOnOdysseyWorld} = odysseyInfoStore;
  const {assetStore} = objectStore;

  const {goToOdysseyHome} = useNavigation();
  const navigate = useNavigate();
  const location = useLocation();

  const alreadyConnected = nftStore.isAlreadyConnected(odyssey?.owner || '');
  const userIsOdysseyOwner = odyssey?.owner === sessionStore.wallet;

  const handleTeleport = useCallback(() => {
    if (assetStore.dockWorldId) {
      goToOdysseyHome(assetStore.dockWorldId);
    } else {
      goToOdysseyHome(odyssey?.uuid || '');
      odysseyInfoStore.resetModel();
    }
  }, [assetStore, goToOdysseyHome, odyssey, odysseyInfoStore]);

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
      layoutSize={{width: '285px'}}
      onClose={() => {
        odysseyInfoStore.resetModel();

        if (universeStore.worldId && matchPath(location.pathname, ROUTES.odyssey.object.root)) {
          navigate(generatePath(ROUTES.odyssey.base, {worldId: universeStore.worldId}));
        }
      }}
      showCloseButton
    >
      <div data-testid="OdysseyInfoWidget-test">
        {odyssey && (
          <OdysseyInfo
            user={odysseyInfoStore.nftUser}
            odyssey={odysseyInfoStore.odyssey}
            onVisit={handleTeleport}
            visitDisabled={universeStore.worldId === odyssey.uuid}
            onConnect={handleConnect}
            connectDisabled={userIsOdysseyOwner || alreadyConnected || sessionStore.isGuest}
            onDock={isOnOdysseyWorld ? undefined : () => {}}
            dockDisabled={true}
          />
        )}
      </div>
    </Dialog>
  );
};

export default observer(WorldOverviewWidget);
