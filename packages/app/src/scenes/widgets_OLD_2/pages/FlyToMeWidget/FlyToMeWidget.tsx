import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';

import * as styled from './FlyToMeWidget.styled';

const FlyToMeWidget: FC = () => {
  const {universeStore, widgetsStore} = useStore();
  const {flyToMeStore} = widgetsStore;

  useEffect(() => {
    flyToMeStore.flyToMe(universeStore.worldId);
    flyToMeStore.dialog.close();
  }, [flyToMeStore, universeStore.worldId]);

  return <styled.Container data-testid="HomePage-test" />;
};

export default observer(FlyToMeWidget);
