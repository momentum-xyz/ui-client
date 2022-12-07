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

  const {nftStore, map3dStore, sessionStore} = useStore();

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

  return (
    <>
      <canvas ref={mapRef} className="webgl" />
      {isCanvasReady && mapRef.current && !nftStore.isLoading && (
        <Map3d
          currentUserId={sessionStore.userId}
          items={nftStore.nftItems}
          canvas={mapRef.current}
          onOdysseyClick={onSelectOdyssey}
        />
      )}
    </>
  );
};

export default observer(Map3dPage);
