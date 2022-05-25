import {AppConfigExtendedInterface} from 'api/interfaces';

/**
 * Constants come from backend.
 * @readonly
 */

export const appVariables: AppConfigExtendedInterface = {
  BACKEND_ENDPOINT_URL: '',
  UNITY_CLIENT_URL: '',
  UNITY_CLIENT_LOADER_URL: '',
  UNITY_CLIENT_DATA_URL: '',
  UNITY_CLIENT_FRAMEWORK_URL: '',
  UNITY_CLIENT_CODE_URL: '',
  UNITY_CLIENT_STREAMING_ASSETS_URL: '',
  UNITY_CLIENT_COMPANY_NAME: '',
  UNITY_CLIENT_PRODUCT_NAME: '',
  UNITY_CLIENT_PRODUCT_VERSION: '',
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
  IS_DEV_ENVIRONMENT: process.env.NODE_ENV === 'development',
  WEB3_PUBLIC_RPC_URL_MAINNET: 'https://mainnet.infura.io/v3/9a6d8c8ccb1a4a51bcf4f30c1acd00df',
  WEB3_PUBLIC_RPC_URL_RINKEBY: 'https://rinkeby.infura.io/v3/9a6d8c8ccb1a4a51bcf4f30c1acd00df',
  GOOGLE_SDK_URL: 'https://apis.google.com/js/api.js',
  YOUTUBE_API: 'https://www.googleapis.com/youtube/v3/playlistItems',
  POLKADOT_CONNECTION_STRING: 'momentum-connections',
  WESTEND_TEST_WS_SERVER: 'wss://westend.api.onfinality.io/public-ws',
  KUSAMA_WS_SERVER: 'wss://kusama-rpc.polkadot.io/'
};
