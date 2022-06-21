import {cast, flow, types} from 'mobx-state-tree';

import {RequestModel, ResetModel} from 'core/models';
import {api, FetchEventsResponse} from 'api';
import {EventStore, EventStoreInterface} from 'stores/MainStore/models';

const EventListStore = types.compose(
  ResetModel,
  types
    .model('EventListStore', {
      request: types.optional(RequestModel, {}),
      eventStores: types.optional(types.array(EventStore), [])
    })
    .actions((self) => ({
      fetchEvents: flow(function* fetchEvents(spaceId: string) {
        const response: FetchEventsResponse = yield self.request.send(
          api.eventsRepository.fetchEvents,
          {
            spaceId
          }
        );

        if (response) {
          self.eventStores.forEach((eventStore) => {
            eventStore.resetModel();
          });

          self.eventStores = cast(
            response.map<EventStoreInterface>((event) => {
              return cast({
                event: {
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
                }
              });
            })
          );

          self.eventStores.forEach((eventStore) => {
            eventStore.init();
          });
        }
      })
    }))
    .views((self) => ({
      get areEventsLoading() {
        return self.request.isPending;
      }
    }))
);

export {EventListStore};
