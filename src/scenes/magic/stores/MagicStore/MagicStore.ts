import {types, Instance, flow, cast} from 'mobx-state-tree';

import {RequestModel, ResetModel} from 'core/models';
import {api, MagicLinkResponse} from 'api';
import {MagicLinkInterface} from 'core/interfaces';
import {SpaceResponse} from 'context/type/Space';

const MagicStore = types
  .compose(
    ResetModel,
    types.model('MagicStore', {
      magic: types.maybe(types.frozen<MagicLinkInterface>()),
      getMagicLinkRequest: types.optional(RequestModel, {}),
      fetchSpaceRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    getMagicLink: flow(function* (key: string) {
      const response: MagicLinkResponse = yield self.getMagicLinkRequest.send(
        api.magicRepository.getMagicLink,
        {key}
      );

      self.magic = cast(response);
    }),
    requestSpaceEnter: flow(function* (spaceId: string) {
      const response: SpaceResponse = yield self.fetchSpaceRequest.send(
        api.spaceRepository.fetchSpace,
        {spaceId}
      );

      if (response) {
        const {space, admin, member} = response;

        if (space.secret === 1 && !(admin || member)) {
          throw new Error('You are not allowed to enter this space');
        }
      }
    })
  }));

export interface MagicStoreInterface extends Instance<typeof MagicStore> {}

export {MagicStore};
