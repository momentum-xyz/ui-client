import React, {useEffect, useReducer} from 'react';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {useStore, useSession} from 'shared/hooks';

import {authDefaultState, AuthState} from './AuthState';
import {AUTH_LOGGED_IN_ACTION, authReducer} from './AuthReducer';

export interface IAuthContextProps {
  authState: AuthState;
}

// TODO: Must be removed
export const AuthContext = React.createContext<IAuthContextProps | undefined>(undefined);

const AuthComponent: React.FC = (props) => {
  const {sessionStore, widgetStore, mainStore} = useStore();
  const {userId, profile} = sessionStore;
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

  // TODO: Move to mst-store
  const [authState, authDispatch] = useReducer(authReducer, authDefaultState);

  // TODO: Already implemented inside SessionStore. Removal
  useEffect(() => {
    if (profile && !authState.user) {
      authDispatch({
        type: AUTH_LOGGED_IN_ACTION,
        payload: {
          // @ts-ignore
          user: {...profile},
          subject: userId
        }
      });
    }
  }, [profile, authState.user, userId]);

  return (
    <AuthContext.Provider value={{authState}}>
      {profile?.profile?.onBoarded && props.children}
    </AuthContext.Provider>
  );
};

export default observer(AuthComponent);
