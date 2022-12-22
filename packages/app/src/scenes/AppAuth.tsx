import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';

const AppAuth: FC = ({children}) => {
  const {authStore, sessionStore} = useStore();

  useEffect(() => {
    if (authStore.hasToken) {
      sessionStore
        .loadUserProfile()
        .catch((err) => {
          console.error('Error while loading user profile', err);
        })
        .then((userId) => {
          if (!userId) {
            document.location.href = ROUTES.signIn;
          }
        });
    } else {
      document.location.href = ROUTES.signIn;
    }
  }, [authStore.hasToken, sessionStore]);

  return <>{sessionStore.isUserReady && children}</>;
};

export default observer(AppAuth);
