import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';

import * as styled from './FlyToMeWidget.styled';

const FlyToMeWidget: FC = () => {
  const {unityStore, widgetsStore} = useStore();
  const {unityWorldStore} = unityStore;
  const {flyToMeStore} = widgetsStore;

  useEffect(() => {
    flyToMeStore.flyToMe(unityWorldStore.worldId);
    flyToMeStore.dialog.close();
  }, [flyToMeStore, unityWorldStore.worldId]);

  return <styled.Container data-testid="HomePage-test" />;
};

export default observer(FlyToMeWidget);
