/**
 * Main constants come from backend.
 */

export interface AppConfigInterface {
  BACKEND_ENDPOINT_URL: string;
  UNITY_CLIENT_URL: string;
  RENDER_SERVICE_URL: string;
  AUTH_SERVICE_URL: string;
  KEYCLOAK_OPENID_CONNECT_URL: string;
  KEYCLOAK_OPENID_CLIENT_ID: string;
  KEYCLOAK_OPENID_SCOPE: string;
  HYDRA_OPENID_CONNECT_URL: string;
  HYDRA_OPENID_CLIENT_ID: string;
  HYDRA_OPENID_GUEST_CLIENT_ID: string;
  HYDRA_OPENID_SCOPE: string;
  WEB3_IDENTITY_PROVIDER_URL: string;
  GUEST_IDENTITY_PROVIDER_URL: string;
  SENTRY_DSN: string;
  AGORA_APP_ID: string;
  GOOGLE_API_CLIENT_ID: string;
  GOOGLE_API_DEVELOPER_KEY: string;
  MIRO_APP_ID: string;
  YOUTUBE_KEY: string;
}

/**
 * Additional constants are defined in app.constants.ts
 */

export interface AppConfigExtendedInterface extends AppConfigInterface {
  IS_DEV_ENVIRONMENT: boolean;
  GOOGLE_SDK_URL: string;
  YOUTUBE_API: string;
}
