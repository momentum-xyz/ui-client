import React, {FC, useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import {Map3dCanvas} from '@momentum-xyz/map3d';

import {useStore} from 'shared/hooks';
import {getImageAbsoluteUrl} from 'core/utils';
import {NftItemInterface} from 'stores/NftStore/models';

interface PropsInterface {
  isClickActive?: boolean;
}

const Map3dPage: FC<PropsInterface> = ({isClickActive}) => {
  const {nftStore, authStore, map3dStore, sessionStore} = useStore();

  const handleSelect = useCallback(
    (uuid: string) => {
      if (isClickActive) {
        const nft = nftStore.nftItems.find((i) => i.uuid === uuid);
        if (nft) {
          map3dStore.selectOdyssey(nft);
        }
      }
    },
    [isClickActive, map3dStore, nftStore.nftItems]
  );

  // FIXME: Make a view under the NFT store
  const friendsWallets = new Set([
    ...nftStore.stakingAtMe.keys(),
    ...nftStore.stakingAtOthers.keys()
  ]);
  const nft = nftStore.getNftByUuid(sessionStore.userId);
  const friendsNfts = nftStore.nftItems.filter((nft) => friendsWallets.has(nft.owner));
  const stakes = {
    [nft?.uuid || '']: friendsNfts.map(({uuid}: NftItemInterface) => ({id: uuid}))
  };

  if (!!authStore.wallet && sessionStore.userId && !nftStore.initialStakingInfoLoaded) {
    return <></>;
  }

  return (
    <>
      {!nftStore.isLoading && (
        <Map3dCanvas
          currentUserId={sessionStore.userId}
          items={nftStore.nftItems}
          connections={stakes}
          getImageAbsoluteUrl={getImageAbsoluteUrl}
          onSelect={handleSelect}
        />
      )}
    </>
  );
};

export default observer(Map3dPage);
