import React, {FC, useEffect} from 'react';

import {use3DMap} from '../../hooks';
import {Map3dPropsInterface} from '../../interfaces';

interface PropsInterface extends Map3dPropsInterface {
  canvas: HTMLCanvasElement;
}

const Map3dRender: FC<PropsInterface> = ({
  currentUserId,
  items,
  connections,
  canvas,
  getImageAbsoluteUrl,
  onSelect
}) => {
  const callbacks = use3DMap(canvas, items, currentUserId, getImageAbsoluteUrl, onSelect);

  useEffect(() => {
    callbacks.drawConnections(connections);

    return () => {
      callbacks.changeWasLoaded();
    };
  }, [callbacks, connections]);

  return <></>;
};

export default Map3dRender;
