import {Instance, types} from 'mobx-state-tree';

import {DialogModel} from 'core/models';

const ParticipantModel = types.model('ParticipantModel', {
  uid: types.union(types.number, types.string),
  menuDialog: types.optional(DialogModel, {})
});

export interface ParticipantModelInterface extends Instance<typeof ParticipantModel> {}

export {ParticipantModel};
