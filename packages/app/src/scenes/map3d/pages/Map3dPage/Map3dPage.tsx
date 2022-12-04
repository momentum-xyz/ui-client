import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';

import {Map3d} from './components';

interface PropsInterface {
  isClickActive?: boolean;
}

const Map3dPage: FC<PropsInterface> = (props) => {
  const {isClickActive} = props;

  const {authStore} = useStore();
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
    (id: string, name: string) => {
      if (isClickActive) {
        //map3dStore.selectOdyssey(id, name);
      }
    },
    [isClickActive]
  );

  return (
    <>
      <canvas ref={mapRef} className="webgl" />
      {isCanvasReady && mapRef.current && (
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
