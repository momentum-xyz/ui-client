import React, {FC, useEffect, useRef, useState} from 'react';
import {observer} from 'mobx-react-lite';

import {Map3dPropsInterface} from '../../interfaces';
import {Map3dRender} from '../Map3dRender';

import * as styled from './Map3dCanvas.styled';

interface PropsInterface extends Map3dPropsInterface {}

const Map3dCanvas: FC<PropsInterface> = (props) => {
  const [isCanvasReady, setIsCanvasReady] = useState<boolean>(false);

  const mapRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      setIsCanvasReady(true);
    }
  }, []);

  return (
    <>
      <styled.MapCanvas ref={mapRef} className="webgl" />
      {isCanvasReady && mapRef.current && <Map3dRender canvas={mapRef.current} {...props} />}
    </>
  );
};

export default observer(Map3dCanvas);
