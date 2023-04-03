import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Map3dCanvas} from '@momentum-xyz/map3d';
import {PositionEnum} from '@momentum-xyz/ui-kit-storybook';
import {UniverseScene} from '@momentum-xyz/odyssey3d';

import {useStore} from 'shared/hooks';
import {getImageAbsoluteUrl} from 'core/utils';
import {WidgetEnum} from 'core/enums';

interface PropsInterface {
  isClickActive?: boolean;
}

// TEMP
const isBabylonUniverse = window.sessionStorage.getItem('babylon_universe');

const Map3dPage: FC<PropsInterface> = () => {
  const {nftStore, widgetsStore, sessionStore, widgetManagerStore} = useStore();
  const {previewOdysseyStore, odysseyInfoStore} = widgetsStore;

  useEffect(() => {
    return () => {
      widgetManagerStore.closeAll();
    };
  }, [widgetManagerStore]);

  const handleSelect = useCallback(
    (uuid: string) => {
      if (sessionStore.isGuest) {
        const nft = nftStore.getNftByUuid(uuid);
        previewOdysseyStore.open(nft!);
      }

      if (!sessionStore.isGuest) {
        widgetManagerStore.open(WidgetEnum.WORLD_OVERVIEW, PositionEnum.LEFT, {id: uuid});
        odysseyInfoStore.open(uuid);
      }
    },
    [nftStore, odysseyInfoStore, previewOdysseyStore, sessionStore.isGuest, widgetManagerStore]
  );

  if (nftStore.isLoading || !sessionStore.map3dUser) {
    return <></>;
  }

  return isBabylonUniverse ? (
    <UniverseScene />
  ) : (
    <Map3dCanvas
      currentUser={sessionStore.map3dUser}
      selectedUuid={odysseyInfoStore.nftId}
      items={nftStore.nftItems}
      getConnections={nftStore.getStakedAtOthersByWallet}
      getImageUrl={getImageAbsoluteUrl}
      onSelect={handleSelect}
    />
  );
};

export default observer(Map3dPage);
