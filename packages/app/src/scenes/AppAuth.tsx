import React, {FC, ReactNode, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useNavigate, useLocation} from 'react-router-dom';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';

const AppAuth: FC<{children: ReactNode}> = ({children}) => {
  const {sessionStore, nftStore} = useStore();

  const navigate = useNavigate();
  const {pathname} = useLocation();

  if (pathname === ROUTES.signIn && !sessionStore.isGuest) {
    navigate(ROUTES.explore);
  }

  if (pathname === ROUTES.explore && sessionStore.isGuest) {
    navigate(ROUTES.signIn);
  }

  useEffect(() => {
    if (sessionStore.wallet && !nftStore.isLoading) {
      nftStore.activateWallet(sessionStore.wallet);
    }
  }, [nftStore, nftStore.isLoading, sessionStore.wallet]);

  return <>{sessionStore.isUserReady && children}</>;
};

export default observer(AppAuth);
