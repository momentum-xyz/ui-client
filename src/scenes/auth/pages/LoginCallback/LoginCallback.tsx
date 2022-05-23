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
      if (!cookie.has(CookieKeyEnum.INTRO)) {
        history.push(ROUTES.intro);
      } else {
        history.push(ROUTES.base);
      }
    }
  }, [auth.isAuthenticated, auth.isLoading, history]);

  return <></>;
};
export default LoginCallback;
