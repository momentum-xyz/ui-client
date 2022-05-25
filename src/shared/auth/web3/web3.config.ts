import {OidcClientSettings, WebStorageStateStore} from 'oidc-client-ts';
import {AuthProviderProps} from 'react-oidc-context';

import {ROUTES} from 'core/constants';
import {appVariables} from 'api/constants';

export const web3OidcConfig = (): OidcClientSettings => {
  return {
    authority: appVariables.HYDRA_OPENID_CONNECT_URL,
    client_id: appVariables.HYDRA_OPENID_CLIENT_ID,
    redirect_uri: `${appVariables.FE_URL}${ROUTES.web3CallBack}`,
    post_logout_redirect_uri: `${appVariables.FE_URL}${ROUTES.login}`,
    scope: appVariables.HYDRA_OPENID_SCOPE || 'openid',
    response_type: 'code',
    loadUserInfo: true,
    extraQueryParams: {
      audience: 'react-client'
    }
  };
};

export const web3ProviderConfig = (): AuthProviderProps => {
  return {
    ...web3OidcConfig(),
    automaticSilentRenew: false,
    userStore: new WebStorageStateStore({store: localStorage})
  };
};
