import {flow, types} from 'mobx-state-tree';

import {DialogModel, RequestModel, ResetModel} from 'core/models';
import {api, FetchUserResponse} from 'api';
import {UserStatusEnum} from 'core/enums';

const ProfileMenuStore = types
  .compose(
    ResetModel,
    types.model('ProfileMenuStore', {
      profileDialog: types.optional(DialogModel, {}),
      profileMenuDialog: types.optional(DialogModel, {}),
      statusChangeRequest: types.optional(RequestModel, {}),
      statusFetchRequest: types.optional(RequestModel, {}),
      status: types.maybe(types.frozen<UserStatusEnum>())
    })
  )
  .actions((self) => ({
    changeStatus: flow(function* (status: UserStatusEnum) {
      yield self.statusChangeRequest.send(api.statusRepository.changeStatus, {status});

      if (self.statusChangeRequest.isDone && !self.statusChangeRequest.isError) {
        self.status = status;
      }
    }),
    fetchStatus: flow(function* () {
      const response: FetchUserResponse = yield self.statusFetchRequest.send(
        api.userRepository.fetchMe
      );

      if (response) {
        self.status = response.status;
      }
    })
  }));

export default ProfileMenuStore;
