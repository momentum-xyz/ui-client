import {types, Instance, cast} from 'mobx-state-tree';
import {ResetModel, Dialog} from '@momentum-xyz/core';

import {User} from 'core/models';

const AttendeesList = types.compose(
  ResetModel,
  types
    .model('AttendeesList', {
      dialog: types.optional(Dialog, {}),
      attendees: types.array(User),
      searchedAttendees: types.maybe(types.array(User)),
      attendeeDialog: types.optional(Dialog, {})
    })
    .actions((self) => ({
      searchAttendees(query: string): void {
        self.searchedAttendees = cast(
          self.attendees?.filter((attendee) => attendee.name.toLowerCase().includes(query))
        );
      }
    }))
);

export type AttendeesListModelType = Instance<typeof AttendeesList>;

export {AttendeesList};
