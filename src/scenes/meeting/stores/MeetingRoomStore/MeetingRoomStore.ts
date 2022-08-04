import {flow, types} from 'mobx-state-tree';

import {RequestModel, ResetModel} from 'core/models';
import {api} from 'api';

import {ParticipantModel} from './models';

const MeetingRoomStore = types
  .compose(
    ResetModel,
    types.model('MeetingRoomStore', {
      request: types.optional(RequestModel, {}),
      participants: types.array(ParticipantModel),
      selectedParticipant: types.maybe(types.union(types.string, types.number)),
      isNormalMode: false,
      isKicked: false
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
    }),
    muteParticipant: flow(function* (spaceId?: string, userId?: string | number) {
      yield self.request.send(api.communicationRepository.muteParticipant, {
        spaceId,
        userId
      });
    }),
    muteAllParticipants: flow(function* (spaceId?: string) {
      yield self.request.send(api.communicationRepository.muteAllParticipants, {
        spaceId
      });
    })
  }));

export {MeetingRoomStore};
