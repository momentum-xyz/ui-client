import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';

import {use3DMap} from 'shared/hooks';
import {getImageAbsoluteUrl} from 'core/utils';
import {NftItemInterface} from 'stores/NftStore/models';

interface PropsInterface {
  currentUserId: string | undefined;
  items: NftItemInterface[];
  connections: Record<string, {id: string}[]>;
  canvas: HTMLCanvasElement;
  onOdysseyClick: (nft: NftItemInterface) => void;
}

const Map3d: FC<PropsInterface> = (props) => {
  const {currentUserId, items, connections, canvas, onOdysseyClick} = props;

  const handleOdysseyClick = useCallback(
    (uuid: string) => {
      const selectedOdyssey = items.find((i) => i.uuid === uuid);
      if (selectedOdyssey) {
        onOdysseyClick(selectedOdyssey);
      }
    },
    [items, onOdysseyClick]
  );

  const callbacks = use3DMap(
    canvas,
    items,
    connections,
    currentUserId,
    getImageAbsoluteUrl,
    handleOdysseyClick
  );

  useEffect(() => {
    return () => {
      callbacks.changeWasLoaded();
    };
  }, [callbacks]);

  return <></>;
};

export default observer(Map3d);
