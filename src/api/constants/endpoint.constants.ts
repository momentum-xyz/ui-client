export const endpoints = {
  backendUrl: window._env_.BACKEND_ENDPOINT_URL as string,
  renderService: window._env_.RENDER_SERVICE_URL as string,
  web3MainNet: window._env_.WEB3_PUBLIC_RPC_URL_MAINNET as string,
  web3RinkeBy: window._env_.WEB3_PUBLIC_RPC_URL_RINKEBY as string,
  web3ProviderUrl: window._env_.WEB3_IDENTITY_PROVIDER_URL as string,
  polkadotConnectionString: 'momentum-connections',
  westendTestWebsocketServer: 'wss://westend.api.onfinality.io/public-ws',
  kusamaWebsocketServer: 'wss://kusama-rpc.polkadot.io/'
};
