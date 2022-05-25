import {OidcClientSettings, WebStorageStateStore} from 'oidc-client-ts';
import {AuthProviderProps} from 'react-oidc-context';

import {ROUTES} from 'core/constants';
import {appVariables} from 'api/constants';

export const keycloakOidcConfig = (): OidcClientSettings => {
  return {
    authority: appVariables.KEYCLOAK_OPENID_CONNECT_URL,
    client_id: appVariables.KEYCLOAK_OPENID_CLIENT_ID,
    redirect_uri: `${appVariables.FE_URL}${ROUTES.callBack}`,
    post_logout_redirect_uri: `${appVariables.FE_URL}${ROUTES.login}`,
    scope: appVariables.KEYCLOAK_OPENID_SCOPE || 'openid',
    response_type: 'code',
    loadUserInfo: true
  };
};

export const keycloakProviderConfig = (): AuthProviderProps => {
  return {
    ...keycloakOidcConfig(),
    automaticSilentRenew: false,
    userStore: new WebStorageStateStore({store: localStorage})
  };
};
