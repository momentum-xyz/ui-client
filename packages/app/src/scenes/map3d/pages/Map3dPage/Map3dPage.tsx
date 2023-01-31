import React, {FC, useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import {Map3dCanvas} from '@momentum-xyz/map3d';

import {useStore} from 'shared/hooks';
import {getImageAbsoluteUrl} from 'core/utils';

interface PropsInterface {
  isClickActive?: boolean;
}

const Map3dPage: FC<PropsInterface> = ({isClickActive}) => {
  const {nftStore, widgetsStore, sessionStore} = useStore();
  const {previewOdysseyStore, odysseyInfoStore} = widgetsStore;

  const handleSelect = useCallback(
    (uuid: string) => {
      const nft = nftStore.getNftByUuid(uuid);

      if (isClickActive && nft && sessionStore.isGuest) {
        previewOdysseyStore.open(nft);
      }

      if (isClickActive && nft && !sessionStore.isGuest) {
        odysseyInfoStore.open(nft);
      }
    },
    [isClickActive, nftStore, odysseyInfoStore, previewOdysseyStore, sessionStore]
  );

  if (nftStore.isLoading) {
    return <></>;
  }

  return (
    <Map3dCanvas
      centerWallet={sessionStore.wallet}
      selectedUuid={odysseyInfoStore.nftId}
      items={nftStore.nftItems}
      getConnections={nftStore.getStakedAtOthersByWallet}
      getImageUrl={getImageAbsoluteUrl}
      onSelect={handleSelect}
    />
  );
};

export default observer(Map3dPage);
