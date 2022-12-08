import React, {FC, useCallback} from 'react';
import {observer} from 'mobx-react-lite';

import {use3DMap} from 'shared/hooks';
import {NftItemInterface} from 'stores/NftStore/models';

interface PropsInterface {
  currentUserId: string | undefined;
  items: NftItemInterface[];
  canvas: HTMLCanvasElement;
  onOdysseyClick: (nft: NftItemInterface) => void;
}

const Map3d: FC<PropsInterface> = (props) => {
  const {currentUserId, items, canvas, onOdysseyClick} = props;

  const handleOdysseyClick = useCallback(
    (uuid: string) => {
      const selectedOdyssey = items.find((i) => i.uuid === uuid);
      if (selectedOdyssey) {
        onOdysseyClick(selectedOdyssey);
      }
    },
    [items, onOdysseyClick]
  );

  use3DMap(canvas, items, currentUserId, handleOdysseyClick);

  return <></>;
};

export default observer(Map3d);
