import {AuthState} from './AuthState';

export const AUTH_LOGGED_IN_ACTION = 'AUTH_LOGGED_IN_ACTION';

interface AuthLoggedInAction {
  type: typeof AUTH_LOGGED_IN_ACTION;
  payload: AuthState;
}

export type AuthActionTypes = AuthLoggedInAction;

export const authReducer = (authState: AuthState, action: AuthActionTypes) => {
  switch (action.type) {
    case AUTH_LOGGED_IN_ACTION:
      return {...action.payload};
    default:
      return {...authState};
  }
};
