import {types, Instance} from 'mobx-state-tree';
import {RequestModel, ResetModel, Dialog} from '@momentum-xyz/core';

import {UserModelInterface, UserSpaceDetails} from 'core/models';

const AttendeesList = types.compose(
  ResetModel,
  types.model('AttendeesList', {
    dialog: types.optional(Dialog, {}),
    query: types.optional(types.string, ''),
    attendees: types.array(types.frozen<UserModelInterface>()),
    request: types.optional(RequestModel, {}),
    attendeeDialog: types.optional(Dialog, {}),
    // TODO: Make proper model for selected user
    userSpaceList: types.optional(types.array(UserSpaceDetails), []),
    spaceListRequest: types.optional(RequestModel, {})
  })
);

export type AttendeesListModelType = Instance<typeof AttendeesList>;

export {AttendeesList};
