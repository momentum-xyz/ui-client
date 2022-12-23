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
    // FIXME: Real connections
    drawConnections(currentUserId, [
      '3eae6c96-ecba-48b9-8b8e-3ca01985c624',
      'cd33f410-7c4d-4c53-b821-30e5f98df01c',
      'f326a467-ba5a-44bd-9808-660b5da561bb'
    ]);
  }, [drawConnections, connections, currentUserId]);

  return <></>;
};

export default Map3dRender;
