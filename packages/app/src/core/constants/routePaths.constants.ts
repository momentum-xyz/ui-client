export const ROUTES = {
  base: '/', // TODO: REMOVAL
  signIn: '/signIn',
  signInAccount: '/signInAccount',
  birth: '/birth',
  explore: '/explore',
  odyssey: {
    base: '/odyssey/:worldId',
    builder: {
      base: '/odyssey/:worldId/worldBuilder',
      skybox: '/odyssey/:worldId/worldBuilder/builderSkybox',
      spawnAsset: {
        base: '/odyssey/:worldId/worldBuilder/spawnAsset',
        basicAssets: '/odyssey/:worldId/worldBuilder/spawnAsset/basic',
        customAssets: '/odyssey/:worldId/worldBuilder/spawnAsset/custom',
        uploadAsset: '/odyssey/:worldId/worldBuilder/spawnAsset/upload'
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
  },
  worldBuilder: {
    // TODO - remove
    base: '/createWorld',
    login: '/createWorld/login',
    start: '/createWorld/start',
    name: '/createWorld/name',
    template: '/createWorld/template',
    generate: '/createWorld/generate',
    builder: '/worldBuilder',
    builderUploadAsset: '/worldBuilder/upload',
    builderSkybox: '/worldBuilder/skybox'
  }
};
