import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router-dom';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';

const FlyWithMePage: FC = () => {
  const {mainStore, collaborationStore} = useStore();
  const {agoraStore} = mainStore;

  const history = useHistory();

  useEffect(() => {
    collaborationStore.setIsFlightWithMe(true);
  }, [collaborationStore]);

  useEffect(() => {
    if (!agoraStore.hasJoined) {
      history.push(ROUTES.base);
    }
  }, [agoraStore, history]);

  return <></>;
};

export default observer(FlyWithMePage);
