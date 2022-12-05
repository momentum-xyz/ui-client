import {cast, flow, types} from 'mobx-state-tree';
import {Dialog, RequestModel, ResetModel} from '@momentum-xyz/core';

import {api, NftFeedItemInterface, NotificationResponse} from 'api';

const NotificationsStore = types
  .compose(
    ResetModel,
    types.model('NotificationsStore', {
      notificationsDialog: types.optional(Dialog, {}),
      notifications: types.optional(types.array(types.frozen<NftFeedItemInterface>()), []),
      request: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    init(): void {
      this.fetchNotifications();
    },
    fetchNotifications: flow(function* () {
      const response: NotificationResponse = yield self.request.send(
        api.feedRepository.fetchNotifications,
        {}
      );
      if (response) {
        self.notifications = cast(response);
      }
    })
  }))
  .views((self) => ({
    get isLoading(): boolean {
      return self.request.isPending;
    }
  }));

export {NotificationsStore};
