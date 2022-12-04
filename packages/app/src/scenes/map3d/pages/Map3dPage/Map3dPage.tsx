import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {NftItemInterface} from 'stores/NftStore/models';

import {Map3d} from './components';

interface PropsInterface {
  isClickActive?: boolean;
}

const Map3dPage: FC<PropsInterface> = (props) => {
  const {isClickActive} = props;

  const {authStore, map3dStore} = useStore();
  const {nftStore} = authStore;

  const [isCanvasReady, setIsCanvasReady] = useState<boolean>(false);
  const mapRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    nftStore.init();
  }, [nftStore]);

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

  return (
    <>
      <canvas ref={mapRef} className="webgl" />
      {isCanvasReady && mapRef.current && nftStore.nftItems.length > 0 && (
        <Map3d
          items={nftStore.nftItems}
          canvasElement={mapRef.current}
          onOdysseyClick={onSelectOdyssey}
        />
      )}
    </>
  );
};

export default observer(Map3dPage);
