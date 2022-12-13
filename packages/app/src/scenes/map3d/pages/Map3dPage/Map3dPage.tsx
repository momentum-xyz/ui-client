import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Map3d} from '@momentum-xyz/map3d';

import {useStore} from 'shared/hooks';
import {getImageAbsoluteUrl} from 'core/utils';
import {NftItemInterface} from 'stores/NftStore/models';

import * as styled from './Map3dPage.styled';

interface PropsInterface {
  isClickActive?: boolean;
}

const Map3dPage: FC<PropsInterface> = (props) => {
  const {isClickActive} = props;

  const {nftStore, authStore, map3dStore, sessionStore} = useStore();

  const [isCanvasReady, setIsCanvasReady] = useState<boolean>(false);

  const mapRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      setIsCanvasReady(true);
    }
  });

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
      <styled.MapCanvas ref={mapRef} className="webgl" />
      {isCanvasReady && mapRef.current && !nftStore.isLoading && (
        <Map3d
          currentUserId={sessionStore.userId}
          items={nftStore.nftItems}
          connections={stakes}
          canvas={mapRef.current}
          getImageAbsoluteUrl={getImageAbsoluteUrl}
          onSelect={handleSelect}
        />
      )}
    </>
  );
};

export default observer(Map3dPage);
