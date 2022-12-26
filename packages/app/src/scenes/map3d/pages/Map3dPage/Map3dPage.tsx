import React, {FC, useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import {Map3dCanvas} from '@momentum-xyz/map3d';

import {useStore} from 'shared/hooks';
import {getImageAbsoluteUrl} from 'core/utils';

interface PropsInterface {
  isClickActive?: boolean;
}

const Map3dPage: FC<PropsInterface> = ({isClickActive}) => {
  const {nftStore, authStore, widgetsStore, sessionStore} = useStore();
  const {odysseyInfoStore} = widgetsStore;

  const handleSelect = useCallback(
    (uuid: string) => {
      if (isClickActive) {
        odysseyInfoStore.open(nftStore.getNftByUuid(uuid));
      }
    },
    [isClickActive, nftStore, odysseyInfoStore]
  );

  if (!!authStore.wallet && sessionStore.userId && !nftStore.initialStakingInfoLoaded) {
    return <></>;
  }

  // TODO: Add function load connection

  return (
    <>
      {!nftStore.isLoading && (
        <Map3dCanvas
          centerWallet={sessionStore.wallet}
          items={nftStore.nftItems}
          getConnections={nftStore.getStakedAtOthersByWallet}
          getImageUrl={getImageAbsoluteUrl}
          onSelect={handleSelect}
        />
      )}
    </>
  );
};

export default observer(Map3dPage);
