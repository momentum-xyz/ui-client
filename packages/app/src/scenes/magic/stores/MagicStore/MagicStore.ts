import {types, flow, cast} from 'mobx-state-tree';
import {RequestModel} from '@momentum/core';
import {ResetModel} from '@momentum/sdk';

import {api, MagicLinkResponse} from 'api';
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
    getMagicLink: flow(function* (id: string) {
      const response: MagicLinkResponse = yield self.request.send(
        api.magicRepository.fetchMagicLink,
        {id}
      );

      self.magic = cast(response);
    })
  }));

export {MagicStore};
