import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel, Dialog} from '@momentum-xyz/core';

import {EventForm, EventItemInterface, EventList, Space} from 'core/models';
import {api, SpaceAttributeItemResponse, SpaceInterface} from 'api';
import {mapper} from 'api/mapper';

const CalendarStore = types.compose(
  ResetModel,
  types
    .model('CalendarStore', {
      formDialog: types.optional(Dialog, {}),
      eventForm: types.optional(EventForm, {}),

      world: types.maybeNull(Space),
      worldRequest: types.optional(RequestModel, {}),

      deleteConfirmationDialog: types.optional(Dialog, {}),
      removeEventRequest: types.optional(RequestModel, {}),
      eventIdToRemove: types.maybe(types.string),

      eventList: types.optional(EventList, {})
    })
    .actions((self) => ({
      editEvent: flow(function* (event: EventItemInterface) {
        yield self.eventForm.editEvent(event);
        self.formDialog.open();
      }),
      selectEventToRemove(event: EventItemInterface) {
        self.eventIdToRemove = event.data?.eventId;
        self.deleteConfirmationDialog.open();
      },
      removeEvent: flow(function* (spaceId: string) {
        if (!self.eventIdToRemove) {
          return false;
        }

        yield self.removeEventRequest.send(api.eventsRepository.deleteEventAttribute, {
          spaceId,
          eventId: self.eventIdToRemove
        });

        if (self.removeEventRequest.isDone) {
          self.eventIdToRemove = undefined;
          self.deleteConfirmationDialog.close();
          self.eventList.fetchSpaceEvents(spaceId);
        }

        return self.removeEventRequest.isDone;
      }),
      fetchWorld: flow(function* (spaceId: string) {
        const response: SpaceAttributeItemResponse = yield self.worldRequest.send(
          api.spaceRepository.fetchSpace,
          {spaceId}
        );

        if (response) {
          self.world = cast({
            id: spaceId,
            ...mapper.mapSpaceSubAttributes<SpaceInterface>(response)
          });
        }
      })
    }))
);

export {CalendarStore};
