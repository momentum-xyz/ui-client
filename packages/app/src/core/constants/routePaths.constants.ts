export const ROUTES = {
  base: '/',
  login: '/login',
  worldBuilderLogin: '/wbLogin',
  loginEmail: '/loginEmail',
  loginWeb3: '/web3/login',
  web3: '/web3',
  consentWeb3: '/web3/consent',
  callBack: '/oidc/callback',
  web3CallBack: '/oidc/web3/callback',
  guestCallBack: '/oidc/guest/callback',
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
    miro: '/collaboration/:spaceId/miro',
    googleDrive: '/collaboration/:spaceId/google-drive',
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
  worldCalendar: '/calendar',
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
    generate: '/createWorld/generate'
  }
};
