import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';

const AppAuth: FC = ({children}) => {
  const {authStore, sessionStore, nftStore} = useStore();

  const history = useHistory();

  useEffect(() => {
    if (authStore.hasToken) {
      sessionStore.loadUserProfile();
    } else {
      history.push(ROUTES.signIn, {from: history.location.pathname});
    }
  }, [authStore.hasToken, history, sessionStore]);

  useEffect(() => {
    if (sessionStore.wallet && !nftStore.isLoading) {
      nftStore.activateWallet(sessionStore.wallet);
    }
  }, [nftStore, nftStore.isLoading, sessionStore.wallet]);

  return <>{sessionStore.isUserReady && children}</>;
};

export default observer(AppAuth);
