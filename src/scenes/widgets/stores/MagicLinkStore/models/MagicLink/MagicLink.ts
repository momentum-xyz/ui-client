import {flow, types} from 'mobx-state-tree';

import {api, MagicLinkResponse} from 'api';
import {MagicTypeEnum} from 'core/enums';
import {RequestModel} from 'core/models';

const MagicLink = types
  .model('MagicLink', {
    request: types.optional(RequestModel, {}),
    id: types.maybeNull(types.string),
    address: types.maybeNull(types.string)
  })
  .actions((self) => ({
    generate: flow(function* (type: MagicTypeEnum, id: string | null, position: any) {
      const payload = id ? {type, data: {id}} : {type, data: {position}};
      const response: MagicLinkResponse = yield self.request.send(
        api.magicRepository.generateLink,
        payload
      );

      if (response?.id) {
        self.id = response.id;
        self.address = `${document.location.origin}/magic/${response.id}`;
      }
    })
  }));
export {MagicLink};
