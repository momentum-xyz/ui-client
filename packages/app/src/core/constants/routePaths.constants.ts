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
      skybox: '/odyssey/:worldId/create/skybox',
      functionality: '/odyssey/:worldId/create/functionality/:objectId',
      objectColor: '/odyssey/:worldId/create/objectColor/:objectId',
      spawnAsset: {
        base: '/odyssey/:worldId/create/spawn',
        basicAssets: '/odyssey/:worldId/create/spawn/basic',
        customAssets: '/odyssey/:worldId/create/spawn/custom',
        uploadAsset: '/odyssey/:worldId/create/spawn/upload',
        selected: '/odyssey/:worldId/create/spawn/:assetCategory/selected'
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
  grabTable: '/:spaceId/table',
  collaboration: {
    root: '/collaboration',
    base: '/collaboration/:spaceId',
    stageMode: `/collaboration/:spaceId/stage-mode`,
    stageModeControl: `/collaboration/:spaceId/stage-mode/control`,
    dashboard: '/collaboration/:spaceId/dashboard',
    calendar: '/collaboration/:spaceId/calendar',
    calendarEvent: '/collaboration/:spaceId/calendar/:eventId',
    screenShare: '/collaboration/:spaceId/screenShare',
    plugin: '/collaboration/:spaceId/:subPath',
    liveStream: '/collaboration/:spaceId/live-stream',
    table: `/collaboration/:spaceId/table`
  },
  spaceAdmin: {
    base: '/space/:spaceId/admin',
    broadcast: '/space/:spaceId/admin/broadcast'
  },
  flyWithMe: {
    pilot: '/flyWithMePilot/:spaceId/:pilotId',
    passenger: '/flyWithMePassenger/:spaceId/:pilotId'
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
