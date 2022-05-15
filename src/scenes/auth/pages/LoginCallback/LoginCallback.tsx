import {FC, useEffect} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {useAuth} from 'react-oidc-context';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';

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
      history.push(ROUTES.base);
    }
  }, [auth.isAuthenticated, auth.isLoading, history]);

  return <></>;
};
export default LoginCallback;
