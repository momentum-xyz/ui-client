import {flow, types} from 'mobx-state-tree';
import {RequestModel} from '@momentum-xyz/core';

import {HostingAllowListItemInterface, api} from 'api';

export const AdminStore = types
  .model('AdminStore', {
    challengeRequest: types.optional(RequestModel, {}),
    whitelist: types.optional(NodeAttribute, {
      attributeName: 'hosting_allow_list'
    })
    hostingAllowListRequest: types.optional(RequestModel, {}),
    hostingAllowListItems: types.optional(types.frozen<HostingAllowListItemInterface[]>(), [])
  })
  .actions((self) => ({
    getNodeSignedChallenge: flow(function* (odyssey_id: string) {
      const response = yield self.challengeRequest.send(api.nodeRepository.getNodeChallenge, {
        odyssey_id
      });
      console.log('getNodeChallenge resp:', response);
      const challenge = response?.challenge;
      if (!challenge) {
        throw new Error('Invalid challenge');
      }
      return challenge;
    }),
    fetchHostingAllowList: flow(function* () {
      const resp = yield self.hostingAllowListRequest.send(
        api.nodeRepository.getHostingAllowList,
        {}
      );
      console.log('getHostingAllowList resp:', resp);

      if (resp) {
        self.hostingAllowListItems = resp;
      }

      return resp;
    }),
    addToHostingAllowList: (data: {wallet?: string; user_id?: string}) => {
      return api.nodeRepository.addToHostingAllowList(data);
    },
    removeFromHostingAllowList: (user_id: string) => {
      return api.nodeRepository.removeFromHostingAllowList({user_id});
    }
  }));
