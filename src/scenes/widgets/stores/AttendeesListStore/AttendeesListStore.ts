import {types} from 'mobx-state-tree';

import {AttendeeModel, DialogModel, ResetModel} from 'core/models';

const AttendeesListStore = types
  .compose(
    ResetModel,
    types.model('AttendeesListStore', {
      dialog: types.optional(DialogModel, {}),
      attendees: types.optional(types.array(AttendeeModel), [])
    })
  )
  .actions((self) => ({
    showAttendees() {
      self.dialog.open();
    }
  }));

export {AttendeesListStore};
