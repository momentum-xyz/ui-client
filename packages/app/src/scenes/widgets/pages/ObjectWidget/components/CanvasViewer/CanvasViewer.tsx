import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Event3dEmitter} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';

import * as styled from './CanvasViewer.styled';

interface PropsInterface {
  onClose: () => void;
}

const CanvasViewer: FC<PropsInterface> = ({onClose}) => {
  const {universeStore, sessionStore} = useStore();
  const {objectStore, world3dStore} = universeStore;
  const {objectContentStore} = objectStore;
  const {canvasContent} = objectContentStore;
  const {userId} = sessionStore;

  useEffect(() => {
    if (world3dStore?.canvasObjectId) {
      canvasContent.loadConfig(world3dStore?.canvasObjectId || '');
      Event3dEmitter.emit('FlyToObject', world3dStore.canvasObjectId);
    }
    return () => {
      canvasContent.resetModel();
    };
  }, [canvasContent, world3dStore, userId]);

  if (canvasContent.isLoading) {
    return <></>;
  }

  return <styled.Container data-testid="CanvasViewer-test">XXX</styled.Container>;
};

export default observer(CanvasViewer);
