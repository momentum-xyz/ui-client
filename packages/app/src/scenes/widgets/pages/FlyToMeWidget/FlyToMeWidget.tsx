import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';

import * as styled from './FlyToMeWidget.styled';

const FlyToMeWidget: FC = () => {
  const {unityStore, widgetsStore} = useStore();
  const {flyToMeStore} = widgetsStore;

  useEffect(() => {
    flyToMeStore.flyToMe(unityStore.worldId);
    flyToMeStore.dialog.close();
  }, [flyToMeStore, unityStore.worldId]);

  return <styled.Container data-testid="HomePage-test" />;
};

export default observer(FlyToMeWidget);
