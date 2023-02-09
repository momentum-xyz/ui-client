import {AppConfigExtendedInterface} from 'api/interfaces';

/**
 * Constants come from backend.
 * @readonly
 */

const BASE_URL = process.env.REACT_APP_CONFIG_URL || document.location.origin;

export const appVariables: AppConfigExtendedInterface = {
  APP_VERSION: process.env.REACT_APP_VERSION || 'v0.0.0',
  BACKEND_API_URL: '',
  BACKEND_ENDPOINT_URL: '',
  BACKEND_V4_ENDPOINT_URL: `${BASE_URL}/api/v4`,
  UNITY_CLIENT_URL: '',
  UNITY_CLIENT_LOADER_URL: '',
  UNITY_CLIENT_DATA_URL: '',
  UNITY_CLIENT_FRAMEWORK_URL: '',
  UNITY_CLIENT_CODE_URL: '',
  UNITY_CLIENT_STREAMING_ASSETS_URL: '',
  UNITY_CLIENT_COMPANY_NAME: '',
  UNITY_CLIENT_PRODUCT_NAME: '',
  UNITY_CLIENT_PRODUCT_VERSION: '',
  UNITY_CLIENT_ADDRESSABLES_URL: '',
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
  YOUTUBE_WELCOME_VIDEO_ID: 'UmSJIEZQAyQ',
  POLKADOT_CONNECTION_STRING: 'momentum-connections',
  WESTEND_TEST_WS_SERVER: 'wss://westend.api.onfinality.io/public-ws',
  BLOCKCHAIN_WS_SERVER: '',
  WIKI_URL: 'https://wiki.odyssey.org/momentum/help/support',
  DISCORD_URL: 'https://discord.gg/6PH9nSu7UP',
  PARTICIPANTS_VIDEO_LIMIT: 17,
  MAX_STAGE_USERS: 12,
  GAT_UI_TYPE_ID: '285ba49f-fee3-40d2-ab55-256b5804c20c',
  STREAMCHAT_KEY: '',
  NFT_ADMIN_ADDRESS: '',
  NFT_COLLECTION_ODYSSEY_ID: '',
  NODE_ID: ''
};

const {REACT_APP_OVERRIDE_CONFIG_VARIABLES = '{}'} = process.env;

export const appVariablesOverrides = JSON.parse(
  REACT_APP_OVERRIDE_CONFIG_VARIABLES
) as Partial<AppConfigExtendedInterface>;
