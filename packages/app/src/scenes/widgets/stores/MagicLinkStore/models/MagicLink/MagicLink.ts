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
    key: 'current-position'
  })
  .views((self) => ({
    get address(): string {
      return `${document.location.origin}${generatePath(ROUTES.magic, {id: self.key})}`;
    },
    get wasCreated(): boolean {
      return self.request.isDone;
    }
  }))
  .actions((self) => ({
    generate: flow(function* (type: MagicTypeEnum, spaceId?: string, position?: any) {
      self.key = uuidv4();
      const response: MagicLinkResponse = yield self.request.send(
        api.magicLinkRepository.createLink,
        {
          key: self.key,
          data: {
            type,
            spaceId,
            position: position ? position : undefined
          }
        }
      );
      if (response) {
        yield copyToClipboard(self.address);
      }
    })
  }));
export {MagicLink};
