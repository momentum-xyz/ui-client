/**
 * Main constants come from backend.
 */

export interface AppConfigInterface {
  BACKEND_ENDPOINT_URL: string;
  // TEMPORARY: remove it when all other BE EP will be migrated to V4 and we fully switch to V4
  BACKEND_V4_ENDPOINT_URL: string;
  UNITY_CLIENT_URL: string;
  UNITY_CLIENT_LOADER_URL: string;
  UNITY_CLIENT_DATA_URL: string;
  UNITY_CLIENT_FRAMEWORK_URL: string;
  UNITY_CLIENT_CODE_URL: string;
  UNITY_CLIENT_STREAMING_ASSETS_URL: string;
  UNITY_CLIENT_COMPANY_NAME: string;
  UNITY_CLIENT_PRODUCT_NAME: string;
  UNITY_CLIENT_PRODUCT_VERSION: string;
  RENDER_SERVICE_URL: string;
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
  STREAMCHAT_KEY: string;
  NFT_ADMIN_ADDRESS: string;
  NFT_COLLECTION_ODYSSEY_ID: string;
  NODE_ID: string;
}

/**
 * Additional constants are defined in app.variables.ts
 */

export interface AppConfigExtendedInterface extends AppConfigInterface {
  APP_VERSION: string;
  FE_URL: string;
  BE_URL: string;
  BACKEND_API_URL: string;
  IS_DEV_ENVIRONMENT: boolean;
  WEB3_PUBLIC_RPC_URL_MAINNET: string;
  WEB3_PUBLIC_RPC_URL_RINKEBY: string;
  POLKADOT_CONNECTION_STRING: string;
  WESTEND_TEST_WS_SERVER: string;
  BLOCKCHAIN_WS_SERVER: string;
  GOOGLE_SDK_URL: string;
  GOOGLE_DOCUMENT_SCOPE: string;
  YOUTUBE_API: string;
  YOUTUBE_WELCOME_VIDEO_ID: string;
  DISCOVER_URL_PROTOCOL: string;
  DISCOVER_URL_DOMAIN: string;
  WIKI_URL: string;
  PARTICIPANTS_VIDEO_LIMIT: number;
  MAX_STAGE_USERS: number;
  GAT_UI_TYPE_ID: string;
}
