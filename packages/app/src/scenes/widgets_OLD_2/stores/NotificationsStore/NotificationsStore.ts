import {cast, flow, types} from 'mobx-state-tree';
import {Dialog, RequestModel, ResetModel} from '@momentum-xyz/core';

import {api, NewsfeedResponse, NewsfeedItemInterface} from 'api';

const NotificationsStore = types
  .compose(
    ResetModel,
    types.model('NotificationsStore', {
      dialog: types.optional(Dialog, {}),
      notifications: types.optional(types.array(types.frozen<NewsfeedItemInterface>()), []),
      request: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    init(): void {
      this.fetchNotifications();
    },
    fetchNotifications: flow(function* () {
      const response: NewsfeedResponse = yield self.request.send(
        // FIXME
        api.newsfeedRepository.fetch,
        {}
      );
      if (response) {
        self.notifications = cast(response.items);
      }
    })
  }))
  .views((self) => ({
    get isLoading(): boolean {
      return self.request.isPending;
    }
  }));

export {NotificationsStore};