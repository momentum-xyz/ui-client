import {flow, types} from 'mobx-state-tree';
import {copyToClipboard, RequestModel} from '@momentum-xyz/core';
import {v4 as uuidv4} from 'uuid';
import {generatePath} from 'react-router-dom';

import {api, MagicLinkResponse} from 'api';
import {MagicTypeEnum} from 'core/enums';
import {ROUTES} from 'core/constants';

const MagicLink = types
  .model('MagicLink', {
    request: types.optional(RequestModel, {}),
    magicLinkId: ''
  })
  .views((self) => ({
    get address(): string | null {
      if (self.magicLinkId) {
        return `${document.location.origin}${generatePath(ROUTES.magic, {id: self.magicLinkId})}`;
      }
      return null;
    },
    get wasCreated(): boolean {
      return self.request.isDone;
    }
  }))
  .actions((self) => ({
    init() {
      self.magicLinkId = uuidv4();
    },
    generate: flow(function* (type: MagicTypeEnum, spaceId?: string, position?: any) {
      const response: MagicLinkResponse = yield self.request.send(
        api.magicLinkRepository.createLink,
        {
          key: self.magicLinkId,
          data: {
            type,
            spaceId,
            position: position ? position : undefined
          }
        }
      );
      if (response && self.address) {
        yield copyToClipboard(self.address);
      }
    })
  }));
export {MagicLink};
