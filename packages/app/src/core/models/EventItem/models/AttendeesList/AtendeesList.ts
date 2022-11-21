import {types, Instance, cast} from 'mobx-state-tree';
import {ResetModel, Dialog} from '@momentum-xyz/core';

import {UserModelInterface} from 'core/models';

const AttendeesList = types.compose(
  ResetModel,
  types
    .model('AttendeesList', {
      dialog: types.optional(Dialog, {}),
      attendees: types.array(types.frozen<UserModelInterface>()),
      searchedAttendees: types.maybe(types.array(types.frozen<UserModelInterface>())),
      attendeeDialog: types.optional(Dialog, {})
    })
    .actions((self) => ({
      searchAttendees(query: string) {
        self.searchedAttendees = cast(
          self.attendees?.filter((attendee) => attendee.name.toLowerCase().includes(query))
        );
      }
    }))
);

export type AttendeesListModelType = Instance<typeof AttendeesList>;

export {AttendeesList};
