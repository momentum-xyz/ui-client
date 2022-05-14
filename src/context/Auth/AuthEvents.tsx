import {useEvent} from '../useEvent';

export const AUTH_LOGGED_IN_EVENT = 'AUTH_LOGGED_IN_EVENT';
export const AUTH_LOGGED_OUT_EVENT = 'AUTH_LOGGED_OUT_EVENT';

interface AuthLoggedInEvent {
  type: typeof AUTH_LOGGED_IN_EVENT;
}

interface AuthLoggedOutEvent {
  type: typeof AUTH_LOGGED_OUT_EVENT;
}

export type AuthEventNames = typeof AUTH_LOGGED_OUT_EVENT | typeof AUTH_LOGGED_OUT_EVENT;
export type AuthEventTypes = AuthLoggedInEvent | AuthLoggedOutEvent;

export const useAuthEvent = (
  eventName: AuthEventNames,
  callback: (event: AuthEventTypes) => void
) => {
  useEvent(eventName, callback);
};
