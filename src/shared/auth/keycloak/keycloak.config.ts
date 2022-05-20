import {OidcClientSettings, WebStorageStateStore} from 'oidc-client-ts';
import {AuthProviderProps} from 'react-oidc-context';

const absolute_base_url = `${window.location.protocol}//${window.location.host}`;

export const keycloakOidcConfig: OidcClientSettings = {
  authority: window._env_.KEYCLOAK_OPENID_CONNECT_URL,
  client_id: window._env_.KEYCLOAK_OPENID_CLIENT_ID,
  redirect_uri: `${absolute_base_url}/oidc/callback`,
  post_logout_redirect_uri: `${absolute_base_url}/login`,
  response_type: 'code',
  scope: window._env_.KEYCLOAK_OPENID_SCOPE || 'openid',
  loadUserInfo: true
};

export const keycloakProviderConfig: AuthProviderProps = {
  ...keycloakOidcConfig,
  automaticSilentRenew: false,
  userStore: new WebStorageStateStore({store: localStorage})
};
