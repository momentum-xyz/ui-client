import {types} from 'mobx-state-tree';
import {RequestModel} from '@momentum-xyz/core';

import {api} from 'api';

export const AdminStore = types
  .model('AdminStore', {
    challengeRequest: types.optional(RequestModel, {})
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
    }
  }));
