import React, {FC} from 'react';

import {use3dMap} from '../../hooks';
import {Map3dPropsInterface} from '../../interfaces';

interface PropsInterface extends Map3dPropsInterface {
  canvas: HTMLCanvasElement;
}

const Map3dRender: FC<PropsInterface> = ({
  centerWallet,
  items,
  canvas,
  getConnections,
  getImageUrl,
  onSelect
}) => {
  use3dMap(canvas, items, centerWallet, getConnections, getImageUrl, onSelect);

  return <></>;
};

export default Map3dRender;
