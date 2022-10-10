import {flow, types} from 'mobx-state-tree';
import {cloneDeep} from 'lodash-es';
import {RequestModel, ResetModel, Dialog} from '@momentum-xyz/core';

import {Space, AgoraRemoteUser, AgoraRemoteUserInterface} from 'core/models';
import {PrivateSpaceError} from 'core/errors';
import {api} from 'api';

import {CalendarStore} from './CalendarStore';
import {MiroBoardStore} from './MiroBoardStore';
import {DashboardStore} from './DashboardStore';
import {GoogleDriveStore} from './GoogleDriveStore';
import {ScreenShareStore} from './ScreenShareStore';
import {StageModeStore} from './StageModeStore';
import {TextChatStore} from './TextChatStore';
import {CollaboarationPluginStore} from './CollaborationPluginsStore';

const RootCollaborationStore = types
  .compose(
    ResetModel,
    types.model('RootCollaborationStore', {
      space: types.maybe(Space),
      dashboardStore: types.optional(DashboardStore, {}),
      textChatStore: types.optional(TextChatStore, {}),
      calendarStore: types.optional(CalendarStore, {}),
      screenShareStore: types.optional(ScreenShareStore, {}),
      miroBoardStore: types.optional(MiroBoardStore, {}),
      googleDriveStore: types.optional(GoogleDriveStore, {}),
      stageModeStore: types.optional(StageModeStore, {}),
      pluginsStore: types.optional(CollaboarationPluginStore, {}),
      isModerator: false,

      participantToRemoveFromStage: types.maybe(AgoraRemoteUser),

      // Requests
      joinMeetingSpaceRequest: types.optional(RequestModel, {}),
      moderationRequest: types.optional(RequestModel, {}),

      // Dialogs
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
      self.space = Space.create({id: spaceId, isTable});

      if (!(yield self.space?.canUserJoin(spaceId))) {
        throw new PrivateSpaceError();
      }

      yield self.space.fetchSpaceInformation();

      self.isModerator = yield self.moderationRequest.send(
        api.spaceIntegrationsRepository.checkSpaceModeration,
        {spaceId}
      );
    }),
    leave: flow(function* () {
      if (!self.space?.isTable) {
        yield self.textChatStore.leaveChannel();
        yield self.textChatStore.logOut();
        self.textChatStore.resetModel();

        self.space = undefined;
        self.isModerator = false;
      }
    }),
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
    get isSpaceLoaded(): boolean {
      return self.space?.didFetchSpaceInformation ?? false;
    },
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
