import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';

import * as styled from './FlyToMeWidget.styled';

const FlyToMeWidget: FC = () => {
  const {mainStore, widgetsStore} = useStore();
  const {flyToMeStore} = widgetsStore;
  const {worldStore} = mainStore;

  useEffect(() => {
    flyToMeStore.flyToMe(worldStore.worldId);
    flyToMeStore.dialog.close();
  }, [flyToMeStore, worldStore.worldId]);

  return <styled.Container data-testid="HomePage-test" />;
};

export default observer(FlyToMeWidget);
