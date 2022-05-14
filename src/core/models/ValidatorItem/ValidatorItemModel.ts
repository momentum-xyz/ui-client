import {types, Instance, flow} from 'mobx-state-tree';

import {api, BaseFavoritesResponse} from 'api';
import {RequestModel} from 'core/models';

const ValidatorItemModel = types
  .model('ValidatorItemModel', {
    id: types.string,
    entity: types.string,
    address: types.string,
    validator: types.string,
    commission: types.union(types.string, types.number),
    isBookmarked: types.optional(types.boolean, false),
    info: types.optional(types.boolean, false),
    reward: types.number,
    hasLink: types.optional(types.boolean, false),
    selected: types.optional(types.boolean, false),
    spaceId: types.string,
    ownStake: types.union(types.number, types.string),
    operatorId: types.optional(types.string, ''),
    request: types.optional(RequestModel, {})
  })
  .actions((self) => ({
    toggleSelected() {
      self.selected = !self.selected;
    },
    unBookmark: flow(function* unBookmark(spaceId: string) {
      const response: BaseFavoritesResponse = yield self.request.send(
        api.favoriteRepository.deleteFavorite,
        {
          spaceId
        }
      );
      if (response) {
        self.isBookmarked = false;
      }
    }),
    bookmark: flow(function* bookmark(spaceId: string) {
      const response: BaseFavoritesResponse = yield self.request.send(
        api.favoriteRepository.postFavorite,
        {
          spaceId: spaceId
        }
      );
      if (response) {
        self.isBookmarked = true;
      }
    })
  }))
  .views(() => ({}));

export interface ValidatorItemModelInterface extends Instance<typeof ValidatorItemModel> {}

export {ValidatorItemModel};
