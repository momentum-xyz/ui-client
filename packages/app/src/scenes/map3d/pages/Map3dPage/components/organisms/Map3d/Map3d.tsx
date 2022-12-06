import React, {FC, useCallback, useRef} from 'react';
import {observer} from 'mobx-react-lite';

import {use3DMap} from 'shared/hooks';
import {NftItemInterface} from 'stores/NftStore/models';

interface PropsInterface {
  items: NftItemInterface[];
  canvasElement: HTMLCanvasElement;
  onOdysseyClick: (nft: NftItemInterface) => void;
}

const Map3d: FC<PropsInterface> = (props) => {
  const {items, canvasElement, onOdysseyClick} = props;

  const wasLoaded = useRef<boolean>(false);

  const handleOdysseyClick = useCallback(
    (id: number) => {
      const selectedOdyssey = items.find((i) => i.id === id);
      if (selectedOdyssey) {
        onOdysseyClick(selectedOdyssey);
      }
    },
    [items, onOdysseyClick]
  );

  const onLoaded = useCallback(() => {
    wasLoaded.current = true;
  }, []);

  // FIXME: Center item id
  // use3DMap(canvasElement, items, items[0].id, wasLoaded.current, onLoaded, handleOdysseyClick);
  use3DMap(canvasElement, items, 0, wasLoaded.current, onLoaded, handleOdysseyClick);

  return <></>;
};

export default observer(Map3d);
