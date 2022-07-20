import {types, flow, cast} from 'mobx-state-tree';

import {api, MagicLinkResponse} from 'api';
import {RequestModel, ResetModel} from 'core/models';
import {MagicLinkInterface} from 'core/interfaces';

const MagicStore = types
  .compose(
    ResetModel,
    types.model('MagicStore', {
      magic: types.maybe(types.frozen<MagicLinkInterface>()),
      request: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    getMagicLink: flow(function* (key: string) {
      const response: MagicLinkResponse = yield self.request.send(
        api.magicRepository.fetchMagicLink,
        {key}
      );

      self.magic = cast(response);
    })
  }));

export {MagicStore};
