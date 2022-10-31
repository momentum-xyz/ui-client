import {flow, types} from 'mobx-state-tree';
import {copyToClipboard, RequestModel} from '@momentum-xyz/core';
import {v4 as uuidv4} from 'uuid';

import {api, MagicLinkResponse} from 'api';
import {MagicTypeEnum} from 'core/enums';

const MagicLink = types
  .model('MagicLink', {
    request: types.optional(RequestModel, {}),
    key: 'current-position'
  })
  .views((self) => ({
    get address(): string {
      return `${document.location.origin}/magic/${self.key}`;
    }
  }))
  .actions((self) => ({
    generate: flow(function* (type: MagicTypeEnum, spaceId: string, position: any) {
      self.key = uuidv4();
      const response: MagicLinkResponse = yield self.request.send(
        api.magicLinkRepository.generateLink,
        {
          type,
          spaceId,
          key: self.key,
          position
        }
      );
      if (response) {
        yield copyToClipboard(self.address);
      }
    })
  }));
export {MagicLink};
