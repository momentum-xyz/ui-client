import React, {useEffect, FC} from 'react';

import {useStore} from 'shared/hooks';

const LoginEmailPage: FC = () => {
  const {loginStore} = useStore().authStore;

  useEffect(() => {
    loginStore.keycloakSignIn();
  }, [loginStore]);

  return <></>;
};

export default LoginEmailPage;
