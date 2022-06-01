import {FC, useEffect} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {useAuth} from 'react-oidc-context';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';
import {cookie} from 'core/services';
import {CookieKeyEnum} from 'core/enums';

const LoginCallback: FC = () => {
  const {loginStore} = useStore().authStore;
  const {search} = useLocation();
  const history = useHistory();
  const auth = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(search as string);
    if (urlParams.get('error')) {
      loginStore.setIsSessionExpired(true);
      history.push(ROUTES.login);
    }
  }, [history, loginStore, search]);

  useEffect(() => {
    if (!auth.isLoading && auth.isAuthenticated) {
      // @ts-ignore: state has type unknown
      const origin = auth.user?.state?.from || ROUTES.base;

      if (!cookie.has(CookieKeyEnum.INTRO)) {
        history.push(ROUTES.intro, {from: origin});
      } else {
        history.push(origin);
      }
    }
  }, [auth.isAuthenticated, auth.isLoading, auth.user, history]);

  return <></>;
};
export default LoginCallback;
