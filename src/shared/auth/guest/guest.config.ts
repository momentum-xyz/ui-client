import {OidcClientSettings, WebStorageStateStore} from 'oidc-client-ts';
import {AuthProviderProps} from 'react-oidc-context';

const absolute_base_url = `${window.location.protocol}//${window.location.host}`;

export const guestOidcConfig: OidcClientSettings = {
  authority: window._env_.HYDRA_OPENID_CONNECT_URL,
  client_id: window._env_.HYDRA_OPENID_GUEST_CLIENT_ID,
  redirect_uri: `${absolute_base_url}/oidc/guest/callback`,
  post_logout_redirect_uri: `${absolute_base_url}/`,
  response_type: 'code',
  scope: window._env_.HYDRA_OPENID_SCOPE || 'openid',
  loadUserInfo: true,
  extraQueryParams: {
    audience: 'react-client'
  }
};

export const guestProviderConfig: AuthProviderProps = {
  ...guestOidcConfig,
  automaticSilentRenew: false,
  userStore: new WebStorageStateStore({store: localStorage})
};
