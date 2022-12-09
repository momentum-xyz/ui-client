import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {NftItemInterface} from 'stores/NftStore/models';

import {Map3d} from './components';
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
  }, []);

  const onSelectOdyssey = useCallback(
    (nft: NftItemInterface) => {
      if (isClickActive) {
        map3dStore.selectOdyssey(nft);
      }
    },
    [isClickActive, map3dStore]
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

  return (
    <>
      <styled.MapCanvas ref={mapRef} className="webgl" />
      {isCanvasReady &&
        mapRef.current &&
        !nftStore.isLoading &&
        (!authStore.wallet || nftStore.initialStakingInfoLoaded) && (
          <Map3d
            currentUserId={sessionStore.userId}
            items={nftStore.nftItems}
            connections={stakes}
            canvas={mapRef.current}
            onOdysseyClick={onSelectOdyssey}
          />
        )}
    </>
  );
};

export default observer(Map3dPage);
