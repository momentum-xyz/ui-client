import {useCallback, useEffect, useRef} from 'react';
import {useAuth} from 'react-oidc-context';

import {extendAxiosInterceptors, refreshAxiosInterceptors} from 'api/request';

const CHECK_INTERVAL_MS = 8 * 1000;
const REMAINING_SEC = 15;

/*
   This hook can be used once.
   Don't use this hook in order to get current user.
*/

export const useSession = (
  tokenRefreshedCallback?: (token?: string) => void,
  tokenNotRefreshedCallback?: (error?: string) => void
) => {
  const signInInterval = useRef<NodeJS.Timeout | null>(null);
  const isInitialized = useRef<boolean>(false);
  const isStopping = useRef<boolean>(false);

  const auth = useAuth();

  const setTokens = useCallback(
    (access_token: string) => {
      extendAxiosInterceptors(access_token);
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
          isStopping.current = true;
          tokenNotRefreshedCallback?.();
        }
      })
      .catch(() => {
        isStopping.current = true;
        tokenNotRefreshedCallback?.();
      });
  }, [auth, setTokens, tokenNotRefreshedCallback]);

  /* 1. Subscribe on 401 error of BE  */
  useEffect(() => {
    refreshAxiosInterceptors(auth, setTokens, tokenNotRefreshedCallback);
  }, [auth, setTokens, tokenNotRefreshedCallback]);

  /* 2. Start checking token expiration time */
  useEffect(() => {
    if (auth.user?.expires_in) {
      console.log(`Expired in ${auth.user?.expires_in}`);
    }

    signInInterval.current = setInterval(() => {
      if (auth.user && (auth.user.expires_in || 0) <= REMAINING_SEC) {
        signInSilent();
      }
    }, CHECK_INTERVAL_MS);

    return () => {
      if (signInInterval.current) {
        clearInterval(signInInterval.current);
      }
    };
  }, [auth, signInSilent]);

  /* 3. Try to refresh token once */
  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated && !isStopping.current) {
      signInSilent();
    }
  }, [auth.isLoading, auth.isAuthenticated, signInSilent]);

  /* 4. User is ready. It must be called once. */
  useEffect(() => {
    if (auth.isAuthenticated && !!auth.user?.access_token && !isInitialized.current) {
      setTokens(auth.user.access_token);
      isInitialized.current = true;
    }
  }, [auth.isAuthenticated, auth.user?.access_token, setTokens]);

  return {isReady: auth.isAuthenticated, idToken: auth.user?.id_token || ''};
};
