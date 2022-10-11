import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router-dom';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';

const FlyWithMePage: FC = () => {
  const {mainStore, flightStore} = useStore();
  const {flyWithMeStore} = flightStore;
  const {agoraStore, unityStore} = mainStore;

  const history = useHistory();

  useEffect(() => {
    flyWithMeStore.start();
    unityStore.toggleMiniMap();

    return () => {
      flyWithMeStore.stop();
      unityStore.toggleMiniMap();
    };
  }, [unityStore, flyWithMeStore]);

  useEffect(() => {
    if (!agoraStore.hasJoined) {
      history.push(ROUTES.base);
    }
  }, [agoraStore, history]);

  return <></>;
};

export default observer(FlyWithMePage);
