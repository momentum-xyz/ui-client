import {flow, Instance, types} from 'mobx-state-tree';

import {RequestModel, ResetModel} from 'core/models';
import {api} from 'api';

import {ParticipantModel} from './models';

const CommunicationLayerStore = types
  .compose(
    ResetModel,
    types.model('CommunicationLayerStore', {
      request: types.optional(RequestModel, {}),
      participants: types.array(ParticipantModel),
      isNormalMode: false,
      isKicked: false,
      selectedParticipant: types.maybe(types.union(types.string, types.number))
    })
  )
  .actions((self) => ({
    selectParticipant(uid?: string | number) {
      self.selectedParticipant = uid;
    },
    changeMode(isStageMode: boolean) {
      self.isNormalMode = !isStageMode;
    },
    setKicked(kick: boolean) {
      self.isKicked = kick;
    },
    removeParticipant: flow(function* (spaceId?: string, userId?: string | number) {
      yield self.request.send(api.communicationRepository.removeParticipant, {
        spaceId,
        userId
      });
    })
  }));

export interface CommunicationLayerStoreInterface
  extends Instance<typeof CommunicationLayerStore> {}

export {CommunicationLayerStore};
