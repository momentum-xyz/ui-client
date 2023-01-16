import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore, useUnityEvent} from 'shared/hooks';

const MinimapWidget: FC = () => {
  const {widgetsStore} = useStore();
  const {minimapStore} = widgetsStore;

  useUnityEvent('HideMinimap', () => {
    minimapStore.dialog.close();
  });

  return <></>;
};

export default observer(MinimapWidget);
