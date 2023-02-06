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
  const {flyToOdyssey, changeOdysseyImage, changeOdysseyName} = use3dMap(
    canvas,
    items,
    currentUser,
    getConnections,
    getImageUrl,
    onSelect
  );

  useEffect(() => {
    changeOdysseyName(currentUser.uuid, currentUser.name);
  }, [currentUser.uuid, currentUser.name, changeOdysseyName]);

  useEffect(() => {
    changeOdysseyImage(currentUser.uuid, getImageUrl(currentUser.image) || '');
  }, [currentUser.uuid, currentUser.image, getImageUrl, changeOdysseyImage]);

  useEffect(() => {
    if (selectedUuid) {
      flyToOdyssey(selectedUuid);
    }
  }, [flyToOdyssey, selectedUuid]);

  return <></>;
};

export default memo(Map3dRender);
