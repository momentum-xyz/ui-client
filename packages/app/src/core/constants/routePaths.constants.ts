export const ROUTES = {
  base: '/', // TODO: REMOVAL
  signIn: '/signIn',
  signInAccount: '/signInAccount',
  birth: '/birth',
  birthAnimation: '/birth/animation',
  explore: '/explore',
  odyssey: {
    base: '/odyssey/:worldId',
    creator: {
      base: '/odyssey/:worldId/create',
      index: '/',
      skybox: 'skybox',
      functionality: 'functionality/:objectId',
      objectColor: 'objectColor/:objectId',
      spawnPoint: 'spawnPoint',
      spawnAsset: {
        base: 'spawn',
        basicAssets: 'basic',
        standardAssets: 'standard',
        customAssets: 'custom',
        uploadAsset: 'upload',
        selected: 'selected'
      }
    },
    object: {
      root: '/odyssey/:worldId/object/:objectId',
      base: '/odyssey/:worldId/object/:objectId/:assetType'
    }
  },
  welcome: '/welcome',
  system: {
    disconnected: '/system/disconnected',
    maintenance: '/system/maintenance',
    wrongBrowser: '/system/wrongBrowser'
  },
  magic: '/magic/:id',
  video: '/video/:spaceId',
  help: '/help',
  storyBook: {
    base: '/storybook',
    atoms: '/storybook/atoms',
    molecules: '/storybook/molecules',
    organisms: '/storybook/organisms'
  }
};
