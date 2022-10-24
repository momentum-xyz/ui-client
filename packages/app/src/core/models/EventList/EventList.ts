import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {EventItem} from 'core/models';
import {api, FetchEventsResponse} from 'api';

const EventList = types.compose(
  ResetModel,
  types
    .model('EventList', {
      request: types.optional(RequestModel, {}),
      events: types.optional(types.array(EventItem), [])
    })
    .actions((self) => ({
      fetchEvents: flow(function* fetchEvents(spaceId: string, children?: boolean) {
        const response: FetchEventsResponse = yield self.request.send(
          api.eventsRepository.fetchEvents,
          {
            spaceId,
            children
          }
        );

        if (response) {
          self.events = cast(
            response.map((event) => ({
              data: {
                ...event,
                start: new Date(event.start),
                end: new Date(event.end)
              }
            }))
          );
        }
      })
    }))
    .views((self) => ({
      get areEventsLoading() {
        return self.request.isPending;
      }
    }))
);

export {EventList};
