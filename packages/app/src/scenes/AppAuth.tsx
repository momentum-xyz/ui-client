import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useHistory, useLocation} from 'react-router-dom';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';

const AppAuth: FC = ({children}) => {
  const {sessionStore, nftStore} = useStore();

  const history = useHistory();
  const {pathname} = useLocation<{pathname: string}>();

  if (pathname === ROUTES.signIn && !sessionStore.isGuest) {
    history.push(ROUTES.explore);
  }

  if (pathname === ROUTES.explore && sessionStore.isGuest) {
    history.push(ROUTES.signIn);
  }

  useEffect(() => {
    if (sessionStore.wallet && !nftStore.isLoading) {
      nftStore.activateWallet(sessionStore.wallet);
    }
  }, [nftStore, nftStore.isLoading, sessionStore.wallet]);

  return <>{sessionStore.isUserReady && children}</>;
};

export default observer(AppAuth);
