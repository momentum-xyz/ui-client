import React, {FC, memo, useEffect} from 'react';

import {use3dMap} from '../../hooks';
import {Map3dPropsInterface} from '../../interfaces';

interface PropsInterface extends Map3dPropsInterface {
  canvas: HTMLCanvasElement;
}

const Map3dRender: FC<PropsInterface> = ({
  currentUser,
  selectedUuid,
  items,
  canvas,
  getConnections,
  getImageUrl,
  onSelect
}) => {
  const {flyToOdyssey, updateOdyssey, clear3dScene} = use3dMap(
    canvas,
    items,
    currentUser,
    getConnections,
    getImageUrl,
    onSelect
  );

  useEffect(() => {
    updateOdyssey(currentUser);
  }, [currentUser, updateOdyssey]);

  useEffect(() => {
    if (selectedUuid) {
      flyToOdyssey(selectedUuid);
    }
  }, [flyToOdyssey, selectedUuid]);

  useEffect(() => {
    return () => {
      clear3dScene();
    };
  }, [clear3dScene]);

  return <></>;
};

export default memo(Map3dRender);
