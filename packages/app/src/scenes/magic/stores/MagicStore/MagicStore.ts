import {types, flow, cast} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {api, GetSpaceAttributeResponse} from 'api';
import {MagicLinkInterface} from 'core/interfaces';
import {mapper} from 'api/mapper';

const MagicStore = types
  .compose(
    ResetModel,
    types.model('MagicStore', {
      magic: types.maybe(types.frozen<MagicLinkInterface>()),
      request: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    getMagicLink: flow(function* (key: string, worldId: string) {
      const response: GetSpaceAttributeResponse = yield self.request.send(
        api.magicLinkRepository.fetchMagicLink,
        {
          key,
          worldId
        }
      );
      if (response) {
        self.magic = cast({
          ...mapper.mapSubAttributeValue<MagicLinkInterface>(response)
        });
      }
    })
  }));

export {MagicStore};
