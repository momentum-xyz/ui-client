import {Instance, types} from 'mobx-state-tree';

import {ResetModel} from 'core/models';

import {ParticipantModel} from './models';

const CommunicationLayerStore = types
  .compose(
    ResetModel,
    types.model('CommunicationLayerStore', {
      participants: types.array(ParticipantModel),
      isNormalMode: false,
      selectedParticipant: types.maybe(types.union(types.string, types.number))
    })
  )
  .actions((self) => ({
    selectParticipant(uid?: string | number) {
      self.selectedParticipant = uid;
    },
    changeMode(isStageMode: boolean) {
      self.isNormalMode = !isStageMode;
    }
  }));

export interface CommunicationLayerStoreInterface
  extends Instance<typeof CommunicationLayerStore> {}

export {CommunicationLayerStore};
