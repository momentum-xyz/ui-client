import React, {FC, useEffect} from 'react';

import {use3dMap} from '../../hooks';
import {Map3dPropsInterface} from '../../interfaces';

interface PropsInterface extends Map3dPropsInterface {
  canvas: HTMLCanvasElement;
}

const Map3dRender: FC<PropsInterface> = ({
  currentUserId,
  items,
  connections,
  canvas,
  getImageUrl,
  onSelect
}) => {
  const {drawConnections} = use3dMap(canvas, items, currentUserId, getImageUrl, onSelect);

  useEffect(() => {
    drawConnections(connections);
  }, [drawConnections, connections]);

  return <></>;
};

export default Map3dRender;
