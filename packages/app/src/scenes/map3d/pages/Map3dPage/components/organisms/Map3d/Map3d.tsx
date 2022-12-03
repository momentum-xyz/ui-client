import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {use3DMap} from 'shared/hooks';
import {NftItemInterface} from 'scenes/birthOfMe/stores/NftStore/models';

interface PropsInterface {
  items: NftItemInterface[];
  canvasElement: HTMLCanvasElement;
  onOdysseyClick: (id: string, name: string) => void;
}

const Map3d: FC<PropsInterface> = (props) => {
  const {items, canvasElement, onOdysseyClick} = props;

  // TODO: Render map using real NTF
  console.log(items);

  use3DMap(canvasElement, onOdysseyClick);

  return <></>;
};

export default observer(Map3d);
