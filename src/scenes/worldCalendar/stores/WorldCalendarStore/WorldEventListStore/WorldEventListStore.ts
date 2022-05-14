import {cast, flow, types} from 'mobx-state-tree';

import {EventItemModel, RequestModel, ResetModel} from 'core/models';
import {api, FetchEventsResponse} from 'api';

const WorldEventListStore = types.compose(
  ResetModel,
  types
    .model('WorldEventListStore', {
      request: types.optional(RequestModel, {}),
      events: types.optional(types.array(EventItemModel), [])
    })
    .actions((self) => ({
      fetchEvents: flow(function* fetchEvents(spaceId: string) {
        const response: FetchEventsResponse = yield self.request.send(
          api.eventsRepository.fetchEvents,
          {
            spaceId,
            children: true
          }
        );

        if (response) {
          self.events = cast(
            response.map((event) => ({
              id: event.id,
              title: event.title,
              description: event.description,
              hosted_by: event.hosted_by,
              image_hash: event.image_hash ?? null,
              web_link: event.web_link,
              spaceName: event.spaceName,
              spaceId: event.spaceId,
              start: new Date(event.start),
              end: new Date(event.end)
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

export {WorldEventListStore};
