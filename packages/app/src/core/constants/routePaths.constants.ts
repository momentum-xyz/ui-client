export const ROUTES = {
  base: '/',
  explore: '/explore',
  welcome: '/explore/welcome',
  odyssey: {
    base: '/odyssey/:worldId',
    object: {
      root: '/odyssey/:worldId/object/:objectId',
      base: '/odyssey/:worldId/object/:objectId/:assetType'
    }
  },
  system: {
    disconnected: '/system/disconnected',
    maintenance: '/system/maintenance',
    wrongBrowser: '/system/wrongBrowser'
  }
};
