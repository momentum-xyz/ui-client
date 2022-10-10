import {types} from 'mobx-state-tree';

const IntegrationData = types.model('IntegrationData', {
  id: types.maybe(types.string),
  userId: types.maybe(types.string),
  name: types.maybe(types.string),
  url: types.maybe(types.string),
  youtubeUrl: types.maybe(types.string),
  viewLink: types.maybe(types.string),
  embedHtml: types.maybe(types.string),
  accessLink: types.maybe(types.string),
  accessLinkPolicy: types.maybe(types.string)
});

export {IntegrationData};
