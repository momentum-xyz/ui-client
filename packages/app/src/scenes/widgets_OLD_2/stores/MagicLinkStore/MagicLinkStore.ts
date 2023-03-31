import {flow, types} from 'mobx-state-tree';
import {copyToClipboard, Dialog, RequestModel, ResetModel} from '@momentum-xyz/core';
import {generatePath} from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';

import {ROUTES} from 'core/constants';
import {MagicTypeEnum} from 'core/enums';
import {api, MagicLinkResponse} from 'api';

const MagicLinkStore = types.compose(
  ResetModel,
  types
    .model('MagicLinkStore', {
      dialog: types.optional(Dialog, {}),
      magicLinkRequest: types.optional(RequestModel, {}),
      magicLinkId: ''
    })
    .views((self) => ({
      get address(): string | null {
        if (self.magicLinkId) {
          return `${document.location.origin}${generatePath(ROUTES.magic, {id: self.magicLinkId})}`;
        }
        return null;
      }
    }))
    .actions((self) => ({
      init() {
        self.magicLinkId = uuidv4();
      },
      copyToClipBoard: flow(function* (type: MagicTypeEnum, odysseyId?: string) {
        const key = self.magicLinkId;
        const data = {odysseyId};

        const response: MagicLinkResponse = yield self.magicLinkRequest.send(
          api.magicLinkRepository.createLink,
          {key, type, data}
        );

        if (response && self.address) {
          yield copyToClipboard(self.address);
        }

        return self.magicLinkRequest.isDone;
      })
    }))
);

export {MagicLinkStore};
