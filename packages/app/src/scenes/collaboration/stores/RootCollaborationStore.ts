import {flow, types} from 'mobx-state-tree';
import {cloneDeep} from 'lodash-es';
import {ResetModel, Dialog} from '@momentum-xyz/core';

import {AgoraRemoteUser, AgoraRemoteUserInterface} from 'core/models';

import {SpaceStore} from './SpaceStore';
import {StageModeStore} from './StageModeStore';
// import {TextChatStore} from './TextChatStore';
import {StreamChatStore} from './StreamChatStore';

const RootCollaborationStore = types
  .compose(
    ResetModel,
    types.model('RootCollaborationStore', {
      // TODO: Refactor Store
      spaceStore: types.optional(SpaceStore, {}),

      // TODO: Removal
      // textChatStore: types.optional(TextChatStore, {}),
      streamChatStore: types.optional(StreamChatStore, {}),
      stageModeStore: types.optional(StageModeStore, {}),

      participantToRemoveFromStage: types.maybe(AgoraRemoteUser),

      // TODO: Make DialogsStore
      newDeviceDialog: types.optional(Dialog, {}),
      removeParticipantFromStageDialog: types.optional(Dialog, {}),
      acceptedToJoinStageDialog: types.optional(Dialog, {}),
      declinedToJoinStageDialog: types.optional(Dialog, {}),
      invitedOnStageDialog: types.optional(Dialog, {}),
      kickUserFromStageDialog: types.optional(Dialog, {}),
      prepareOnStageDialog: types.optional(Dialog, {}),
      countdownDialog: types.optional(Dialog, {})
    })
  )
  .actions((self) => ({
    join: flow(function* (spaceId: string, isTable = false) {
      yield self.spaceStore.init(spaceId, isTable);
    }),
    leave() {
      self.spaceStore.resetModel();
      if (!self.spaceStore?.isTable) {
        // TODO: Removal textChatStore
        // yield self.textChatStore.leaveChannel();
        // yield self.textChatStore.logOut();
        // self.textChatStore.resetModel();

        self.streamChatStore.deinit(self.spaceStore?.id);
      }
    },
    selectUserToRemoveAndOpenDialog(remoteUser: AgoraRemoteUserInterface) {
      self.participantToRemoveFromStage = cloneDeep(remoteUser);
      self.removeParticipantFromStageDialog.open();
    },
    unselectUserToRemoveAndCloseDialog() {
      self.participantToRemoveFromStage = undefined;
      self.removeParticipantFromStageDialog.close();
    }
  }))
  .views((self) => ({
    get isModerator(): boolean {
      return self.spaceStore.isModerator;
    },
    // TODO: Move to DialogsStore
    get isHandlingInviteOrRequest(): boolean {
      return (
        self.acceptedToJoinStageDialog.isOpen ||
        self.invitedOnStageDialog.isOpen ||
        self.prepareOnStageDialog.isOpen ||
        self.countdownDialog.isOpen
      );
    }
  }));

export {RootCollaborationStore};
