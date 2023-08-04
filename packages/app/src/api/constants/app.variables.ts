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
  RENDER_SERVICE_URL: '',
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
  BLOCKCHAIN_ID: 412346,
  CONTRACT_STAKING_ADDRESS: '0xb187f16656C30580bB0B0b797DaDB9CFab766156',
  CONTRACT_MOM_ADDRESS: '0x567d4e8264dC890571D5392fDB9fbd0e3FCBEe56',
  CONTRACT_DAD_ADDRESS: '0x0244BbA6fcB25eFed05955C4A1B86A458986D2e0',
  CONTRACT_NFT_ADDRESS: '0x97E0B10D89a494Eb5cfFCc72853FB0750BD64AcD',
  CONTRACT_FAUCET_ADDRESS: '0x9E760F1CddA0694B6156076C60657118CF874289',
  MINT_NFT_AMOUNT: '4.20',
  MINT_NFT_DEPOSIT_ADDRESS: '0x683642c22feDE752415D4793832Ab75EFdF6223c',
  WIKI_URL: 'https://wiki.odyssey.org/momentum/help/support',
  DISCORD_URL: 'https://discord.gg/6PH9nSu7UP',
  PARTICIPANTS_VIDEO_LIMIT: 17,
  MAX_STAGE_USERS: 12,
  GAT_UI_TYPE_ID: '285ba49f-fee3-40d2-ab55-256b5804c20c',
  STREAMCHAT_KEY: '',
  NFT_ADMIN_ADDRESS: '',
  NFT_COLLECTION_ODYSSEY_ID: '',
  NODE_ID: '',
  ODYSSEY_WORLD_ID: 'b8b104c4-b375-4933-8de8-29e0a1c67860',
  FEATURE_FLAGS: {
    newsfeed: process.env.NODE_ENV === 'development'
  }
};

const {REACT_APP_OVERRIDE_CONFIG_VARIABLES = '{}'} = process.env;

export const appVariablesOverrides = JSON.parse(
  REACT_APP_OVERRIDE_CONFIG_VARIABLES
) as Partial<AppConfigExtendedInterface>;
