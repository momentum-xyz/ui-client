import {useCallback, useEffect, useRef} from 'react';
import {useAuth} from 'react-oidc-context';

import {extendAxiosInterceptors, refreshAxiosInterceptors} from 'api/request';

const CHECK_INTERVAL_MS = 5 * 1000;
const REMAINING_SEC = 10;

/*
   This hook can be used once.
   Don't use this hook in order to get current user.
*/

export const useSession = (
  tokenRefreshedCallback: (token?: string) => void,
  tokenNotRefreshedCallback?: (error?: string) => void
) => {
  const signInInterval = useRef<NodeJS.Timeout | null>(null);
  const isStopping = useRef<boolean>(false);

  const auth = useAuth();

  const setTokens = (access_token: string) => {
    extendAxiosInterceptors(access_token);
    tokenRefreshedCallback(access_token);
  };

  const signInSilent = useCallback(() => {
    auth
      .signinSilent()
      .then((user) => {
        if (user?.access_token) {
          setTokens(user.access_token);
          console.log('refreshed');
        } else {
          console.log('not refreshed');
          isStopping.current = true;
          tokenNotRefreshedCallback?.();
        }
      })
      .catch(() => {
        console.log('not refreshed');
        isStopping.current = true;
        tokenNotRefreshedCallback?.();
      });
  }, [auth]);

  /* 0. If there is no oidc.user it will redirect to login page */
  useEffect(() => {
    const keyList: string[] = Object.keys(localStorage);
    if (!keyList.find((key) => key.startsWith('oidc.user'))) {
      tokenNotRefreshedCallback?.();
    }
  }, []);

  /* 1. Subscribe on 401 error of BE  */
  useEffect(() => {
    refreshAxiosInterceptors(auth, tokenRefreshedCallback, tokenNotRefreshedCallback);
  }, [auth, tokenRefreshedCallback, tokenNotRefreshedCallback]);

  /* 2. Start checking token expiration time */
  useEffect(() => {
    signInInterval.current = setInterval(() => {
      console.log(auth.user?.expires_in);
      if (auth.user && (auth.user.expires_in || 0) <= REMAINING_SEC) {
        signInSilent();
      }
    }, CHECK_INTERVAL_MS);

    return () => {
      if (signInInterval.current) {
        clearInterval(signInInterval.current);
      }
    };
  }, [auth]);

  /* 3. Try to refresh token once */
  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated && !isStopping.current) {
      signInSilent();
    }
  }, [auth.isLoading, auth.isAuthenticated]);

  /* 4. User is ready */
  useEffect(() => {
    if (!auth.isLoading && auth.isAuthenticated && !!auth?.user) {
      setTokens(auth.user.access_token);
    }
  }, [auth.isLoading, auth.isAuthenticated]);

  return {isReady: auth.isAuthenticated, idToken: auth.user?.id_token || ''};
};
