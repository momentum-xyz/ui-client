import {flow, types} from 'mobx-state-tree';

import {DialogModel, RequestModel, ResetModel} from 'core/models';
import {api} from 'api';
import {MagicTypeEnum} from 'core/enums';

import {WorldEventListStore} from './WorldEventListStore';

const WorldCalendarStore = types.compose(
  ResetModel,
  types
    .model('WorldCalendarStore', {
      weblinkDialog: types.optional(DialogModel, {}),
      magicDialog: types.optional(DialogModel, {}),
      eventListStore: types.optional(WorldEventListStore, {}),
      magicId: types.maybe(types.string),
      magicLinkRequest: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      showMagicLink: flow(function* (spaceId: string, eventId: string) {
        const response = yield self.magicLinkRequest.send(api.magicRepository.generateLink, {
          type: MagicTypeEnum.EVENT,
          data: {
            id: spaceId,
            eventId: eventId
          }
        });

        if (response) {
          self.magicId = response.id;
          self.magicDialog.open();
        }
      })
    }))
);

export {WorldCalendarStore};
