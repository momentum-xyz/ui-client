import {useCallback, useEffect, useRef} from 'react';
import {useAuth} from 'react-oidc-context';

import {useUnityEvent} from 'shared/hooks';
import {refreshAxiosToken} from 'api/request';

/*
   This hook can be used once.
   Don't use this hook in order to get current user.
*/

export const useSession = (
  tokenRefreshedCallback?: (token?: string) => void,
  tokenNotRefreshedCallback?: (error?: string) => void
) => {
  const wasInitialized = useRef<boolean>(false);

  const auth = useAuth();

  const setTokens = useCallback(
    (access_token: string) => {
      refreshAxiosToken(access_token);
      tokenRefreshedCallback?.(access_token);
    },
    [tokenRefreshedCallback]
  );

  const signInSilent = useCallback(() => {
    auth
      .signinSilent()
      .then((user) => {
        if (user?.access_token) {
          setTokens(user.access_token);
        } else {
          tokenNotRefreshedCallback?.();
        }
      })
      .catch(() => {
        tokenNotRefreshedCallback?.();
      });
  }, [auth, setTokens, tokenNotRefreshedCallback]);

  // TODO: Remove. For testing
  useEffect(() => {
    console.log(`[Auth: expires in ${auth.user?.expires_in}]`);
  }, [auth.user]);

  /* 0. Unity has invalid token by some reason */
  useUnityEvent('InvalidToken', () => {
    signInSilent();
  });

  /* 1. Token is expiring */
  useEffect(() => {
    return auth.events.addAccessTokenExpiring(() => {
      console.log(`[Auth: expiring ${auth.user?.expires_in}]`);
      signInSilent();
    });
  }, [auth, signInSilent]);

  /* 2. Token was expired */
  useEffect(() => {
    return auth.events.addAccessTokenExpired(() => {
      console.log(`[Auth: expired ${auth.user?.expires_in}]`);
      signInSilent();
    });
  }, [auth, signInSilent]);

  /* 3. User is ready. It must be called once. */
  useEffect(() => {
    if (auth.isAuthenticated && !!auth.user?.access_token && !wasInitialized.current) {
      setTokens(auth.user.access_token);
      wasInitialized.current = true;
    }
  }, [auth.isAuthenticated, auth.user?.access_token, setTokens]);

  return {isReady: auth.isAuthenticated, idToken: auth.user?.id_token || ''};
};
