import {types, Instance, flow, cast} from 'mobx-state-tree';

import {RequestModel, ResetModel} from 'core/models';
import {api, MagicLinkResponse} from 'api';
import {MagicLinkInterface} from 'core/interfaces';

const MagicStore = types
  .compose(
    ResetModel,
    types.model('MagicStore', {
      magic: types.maybe(types.frozen<MagicLinkInterface>()),
      getMagicLinkRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    getMagicLink: flow(function* (key: string) {
      const response: MagicLinkResponse = yield self.getMagicLinkRequest.send(
        api.magicRepository.getMagicLink,
        {key}
      );

      self.magic = cast(response);
    })
  }));

export interface MagicStoreInterface extends Instance<typeof MagicStore> {}

export {MagicStore};
