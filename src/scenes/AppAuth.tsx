import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {useStore, useSession} from 'shared/hooks';

const AppAuth: FC = ({children}) => {
  const {sessionStore, widgetStore, mainStore} = useStore();
  const {profile} = sessionStore;
  const {helpStore} = widgetStore;
  const {unityStore} = mainStore;

  const history = useHistory();

  const onSuccess = (token?: string) => unityStore.setAuthToken(token);
  const onError = () => history.push(ROUTES.login, {from: history.location.pathname});

  const {isReady, idToken} = useSession(onSuccess, onError);

  /* 1. Load user profile */
  useEffect(() => {
    if (isReady && !profile) {
      sessionStore.init(idToken);
    }
  }, [idToken, isReady, profile, sessionStore]);

  /* 2. Open Complete Registration form */
  useEffect(() => {
    if (isReady && !!profile && !profile.profile?.onBoarded) {
      history.push(ROUTES.signUpComplete, {from: history.location.pathname});
      helpStore.helpDialog.open();
    }
  }, [helpStore, history, isReady, profile]);

  return <>{profile?.profile?.onBoarded && children}</>;
};

export default observer(AppAuth);
