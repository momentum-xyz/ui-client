import {Instance, types} from 'mobx-state-tree';

const ParticipantModel = types.model('ParticipantModel', {});

export interface ParticipantModelInterface extends Instance<typeof ParticipantModel> {}

export {ParticipantModel};
