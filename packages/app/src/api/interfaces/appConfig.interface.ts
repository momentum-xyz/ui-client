/**
 * Main constants come from backend.
 */

export interface AppConfigInterface {
  BACKEND_ENDPOINT_URL: string;
  // TEMPORARY: remove it when all other BE EP will be migrated to V4 and we fully switch to V4
  BACKEND_V4_ENDPOINT_URL: string;
  RENDER_SERVICE_URL: string;
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
  CONTRACT_STAKING_ADDRESS: string;
  CONTRACT_MOM_ADDRESS: string;
  CONTRACT_DAD_ADDRESS: string;
  CONTRACT_NFT_ADDRESS: string;
  CONTRACT_FAUCET_ADDRESS: string;
  CONTRACT_MAPPING_ADDRESS: string;
  MINT_NFT_AMOUNT: string;
  MINT_NFT_DEPOSIT_ADDRESS: string;
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
  BLOCKCHAIN_ID: number;
  GOOGLE_SDK_URL: string;
  GOOGLE_DOCUMENT_SCOPE: string;
  YOUTUBE_API: string;
  YOUTUBE_WELCOME_VIDEO_ID: string;
  WIKI_URL: string;
  DISCORD_URL: string;
  PARTICIPANTS_VIDEO_LIMIT: number;
  MAX_STAGE_USERS: number;
  GAT_UI_TYPE_ID: string;
  ODYSSEY_WORLD_ID: string;
  FEATURE_FLAGS: {[key: string /*FeatureFlagEnum*/]: boolean};
  AI_PROVIDERS: {[key: string /*AIProvidersFlagEnum*/]: boolean};
}
