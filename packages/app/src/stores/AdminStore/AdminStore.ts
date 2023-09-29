import {types} from 'mobx-state-tree';
import {RequestModel} from '@momentum-xyz/core';

import {api} from 'api';
import {NodeAttribute} from 'core/models';

export const AdminStore = types
  .model('AdminStore', {
    challengeRequest: types.optional(RequestModel, {}),
    whitelist: types.optional(NodeAttribute, {
      attributeName: 'hosting_allow_list'
    })
  })
  .actions((self) => ({
    getNodeSignedChallenge: async (odyssey_id: string) => {
      const response = await self.challengeRequest.send(api.nodeRepository.getNodeChallenge, {
        odyssey_id
      });
      console.log('getNodeChallenge resp:', response);
      const challenge = response?.challenge;
      if (!challenge) {
        throw new Error('Invalid challenge');
      }
      return challenge;
    },
    fetchHostingAllowList: async () => {
      await self.whitelist.load();
      return self.whitelist.value;
    },
    addToHostingAllowList: (data: {wallet?: string; user_id?: string}) => {
      return api.nodeRepository.addToHostingAllowList(data);
    },
    removeFromHostingAllowList: (user_id: string) => {
      return api.nodeRepository.removeFromHostingAllowList({user_id});
    }
  }))
  .views((self) => ({
    get hostingAllowListItems(): string[] {
      return (self.whitelist.value?.users as string[]) || [];
    }
  }));
