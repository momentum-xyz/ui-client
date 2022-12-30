import React, {FC, useEffect} from 'react';

import {use3dMap} from '../../hooks';
import {Map3dPropsInterface} from '../../interfaces';

interface PropsInterface extends Map3dPropsInterface {
  canvas: HTMLCanvasElement;
}

const Map3dRender: FC<PropsInterface> = ({
  centerWallet,
  selectedUuid,
  items,
  canvas,
  getConnections,
  getImageUrl,
  onSelect
}) => {
  const {flyToPlanet} = use3dMap(
    canvas,
    items,
    centerWallet,
    getConnections,
    getImageUrl,
    onSelect
  );

  useEffect(() => {
    if (selectedUuid) {
      flyToPlanet(selectedUuid);
    }
  }, [flyToPlanet, selectedUuid]);

  return <></>;
};

export default Map3dRender;
