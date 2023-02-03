import React, {FC, useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import {Dialog} from '@momentum-xyz/ui-kit';
import {generatePath, matchPath, useHistory} from 'react-router-dom';

import {OdysseyInfo} from 'ui-kit/molecules/OdysseyInfo';
import {useNavigation, useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';

const MENU_OFFSET_LEFT = 10;
const MENU_OFFSET_TOP = 20;

const OdysseyInfoWidget: FC = () => {
  const {sessionStore, nftStore, widgetsStore, objectStore, unityStore} = useStore();
  const {odysseyInfoStore} = widgetsStore;
  const {odyssey} = odysseyInfoStore;
  const {assetStore} = objectStore;

  const history = useHistory();
  const {goToOdysseyHome} = useNavigation();

  const alreadyConnected = nftStore.isAlreadyConnected(odyssey?.owner || '');

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

        if (
          unityStore.worldId &&
          matchPath(history.location.pathname, ROUTES.odyssey.object.root)
        ) {
          history.push(generatePath(ROUTES.odyssey.base, {worldId: unityStore.worldId}));
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
            onConnect={handleConnect}
            onDock={() => {}}
            visitDisabled={unityStore.worldId === sessionStore.userId}
            connectDisabled={
              odyssey?.owner === sessionStore.wallet || alreadyConnected || sessionStore.isGuest
            }
            dockDisabled={true}
          />
        )}
      </div>
    </Dialog>
  );
};

export default observer(OdysseyInfoWidget);
