import {AppConfigExtendedInterface} from 'api/interfaces';

/**
 * Constants come from backend.
 * @readonly
 */

const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? process.env.REACT_APP_CONFIG_URL || ''
    : document.location.origin;

export const appVariables: AppConfigExtendedInterface = {
  APP_VERSION: 'v0.14.2',
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
  FE_URL: document.location.origin,
  BE_URL: BASE_URL,
  IS_DEV_ENVIRONMENT: process.env.NODE_ENV === 'development',
  WEB3_PUBLIC_RPC_URL_MAINNET: 'https://mainnet.infura.io/v3/9a6d8c8ccb1a4a51bcf4f30c1acd00df',
  WEB3_PUBLIC_RPC_URL_RINKEBY: 'https://rinkeby.infura.io/v3/9a6d8c8ccb1a4a51bcf4f30c1acd00df',
  GOOGLE_SDK_URL: 'https://apis.google.com/js/api.js',
  GOOGLE_DOCUMENT_SCOPE: 'https://www.googleapis.com/auth/drive.file',
  YOUTUBE_API: 'https://www.googleapis.com/youtube/v3/playlistItems',
  YOUTUBE_INTRO_VIDEO_ID: 'UmSJIEZQAyQ',
  POLKADOT_CONNECTION_STRING: 'momentum-connections',
  WESTEND_TEST_WS_SERVER: 'wss://westend.api.onfinality.io/public-ws',
  KUSAMA_WS_SERVER: 'wss://kusama-rpc.polkadot.io/',
  WIKI_URL: 'https://wiki.odyssey.org/momentum/help/support',
  PARTICIPANTS_VIDEO_LIMIT: 17,
  MAX_STAGE_USERS: 12
};
