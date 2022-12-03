import React, {FC, useCallback, useRef} from 'react';
import {observer} from 'mobx-react-lite';

import {use3DMap} from 'shared/hooks';
import {NftItemInterface} from 'stores/NftStore/models';

interface PropsInterface {
  items: NftItemInterface[];
  canvasElement: HTMLCanvasElement;
  onOdysseyClick: (id: string, name: string) => void;
}

const Map3d: FC<PropsInterface> = (props) => {
  const {items, canvasElement, onOdysseyClick} = props;

  const wasLoaded = useRef<boolean>(false);

  const onLoaded = useCallback(() => {
    wasLoaded.current = true;
  }, []);

  // TODO: Render map using real NTF
  console.log(items);

  use3DMap(canvasElement, wasLoaded.current, onLoaded, onOdysseyClick);

  return <></>;
};

export default observer(Map3d);
