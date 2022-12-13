import React, {FC, useEffect} from 'react';

import {use3DMap} from '../../hooks';
import {PlanetInterface} from '../../interfaces';

interface PropsInterface {
  currentUserId: string | undefined;
  items: PlanetInterface[];
  connections: Record<string, {id: string}[]>;
  canvas: HTMLCanvasElement;
  getImageAbsoluteUrl(imageUrlOrHash: string | undefined | null): string | null;
  onSelect: (uuid: string) => void;
}

const Map3d: FC<PropsInterface> = ({
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

export default Map3d;
