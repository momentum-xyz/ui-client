import {AppConfigExtendedInterface} from 'api/interfaces';

/**
 * Constants come from backend.
 * @readonly
 */

export const appConstants: AppConfigExtendedInterface = {
  IS_DEV_ENVIRONMENT: process.env.NODE_ENV === 'development',
  BACKEND_ENDPOINT_URL: '',
  UNITY_CLIENT_URL: '',
  RENDER_SERVICE_URL: '',
  AUTH_SERVICE_URL: '',
  KEYCLOAK_OPENID_CONNECT_URL: '',
  KEYCLOAK_OPENID_CLIENT_ID: '',
  KEYCLOAK_OPENID_SCOPE: '',
  HYDRA_OPENID_CONNECT_URL: '',
  HYDRA_OPENID_CLIENT_ID: '',
  HYDRA_OPENID_GUEST_CLIENT_ID: '',
  HYDRA_OPENID_SCOPE: '',
  WEB3_IDENTITY_PROVIDER_URL: '',
  GUEST_IDENTITY_PROVIDER_URL: '',
  SENTRY_DSN: '',
  AGORA_APP_ID: '',
  GOOGLE_API_CLIENT_ID: '',
  GOOGLE_API_DEVELOPER_KEY: '',
  MIRO_APP_ID: '',
  YOUTUBE_KEY: '',
  GOOGLE_SDK_URL: 'https://apis.google.com/js/api.js',
  YOUTUBE_API: 'https://www.googleapis.com/youtube/v3/playlistItems'
};
