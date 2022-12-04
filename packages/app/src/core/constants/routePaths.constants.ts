export const ROUTES = {
  base: '/',
  signIn: '/signIn',
  signInAccount: '/signInAccount',
  birth: '/birth',
  explore: '/explore',
  login: '/login', // TODO: Remove
  worldBuilderLogin: '/wbLogin', // TODO: Remove
  loginEmail: '/loginEmail', // TODO: Remove
  loginWeb3: '/web3/login', // TODO: Remove
  web3: '/web3', // TODO: Remove
  consentWeb3: '/web3/consent', // TODO: Remove
  callBack: '/oidc/callback', // TODO: Remove
  web3CallBack: '/oidc/web3/callback', // TODO: Remove
  guestCallBack: '/oidc/guest/callback', // TODO: Remove
  welcome: '/welcome',
  signUpComplete: '/profile/signUpComplete',
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
  object: {
    root: '/object/:objectId',
    base: '/object/:objectId/:assetType'
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
