import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';
import {v4 as uuidv4} from 'uuid';

import {EventItemModel, EventDataInterface} from 'core/models';
import {api, EventItemInterface, FetchEventsResponse, SpaceAttributeItemResponse} from 'api';
import {mapper} from 'api/mapper';

const EventList = types.compose(
  ResetModel,
  types
    .model('EventList', {
      request: types.optional(RequestModel, {}),
      attendeesRequest: types.optional(RequestModel, {}),
      events: types.optional(types.array(EventItemModel), [])
    })
    .actions((self) => ({
      mapAttendees(response: SpaceAttributeItemResponse) {
        const eventsArray = mapper.mapSpaceAttributeValues<EventDataInterface>(response);
        self.events = cast(
          eventsArray.map((event) => ({
            attendees: {
              ...Object.values(event.attendees ?? {})
            }
          }))
        );
      },
      mapEvents(response: SpaceAttributeItemResponse) {
        const eventsArray = mapper.mapSpaceAttributeValues<EventDataInterface>(response);
        if (eventsArray) {
          self.events = cast(
            eventsArray.map((event) => ({
              data: {
                ...event,
                start: new Date(event.start),
                end: new Date(event.end)
              },
              attendees: [...Object.values(event.attendees ?? {})]
            }))
          );
        }
      }
    }))
    .actions((self) => ({
      fetchSpaceEvents: flow(function* fetchEvents(spaceId: string) {
        const response: SpaceAttributeItemResponse = yield self.request.send(
          api.eventsRepository.getEventAttributes,
          {
            spaceId
          }
        );

        if (Object.keys(response).length) {
          self.mapEvents(response);
        }

        return self.request.isDone;
      }),
      fetchEvents: flow(function* fetchEvents(spaceId: string, children?: boolean) {
        const response: FetchEventsResponse = yield self.request.send(
          api.old_eventsRepository.fetchEvents,
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
      }),
      updateEventAttendees: flow(function* (data: EventItemInterface, spaceId: string) {
        const eventId = uuidv4();

        const event: EventItemInterface = {
          ...data
        };

        yield self.attendeesRequest.send(api.eventsRepository.setEventAttributes, {
          spaceId,
          data: event,
          eventId
        });

        return self.attendeesRequest.isDone;
      })
    }))
    .views((self) => ({
      get areEventsLoading() {
        return self.request.isPending;
      }
    }))
);

export {EventList};
