import {observer} from 'mobx-react-lite';
import {FC} from 'react';
import {generatePath, useHistory} from 'react-router-dom';
import {toast} from 'react-toastify';
import {useTranslation} from 'react-i18next';

import {PosBusEventEnum, StageModeRequestEnum, StageModeStatusEnum} from 'core/enums';
import {ROUTES} from 'core/constants';
import {LiveStreamInterface} from 'api';
import {usePosBusEvent, useStore} from 'shared/hooks';
import {ToastContent, TOAST_COMMON_OPTIONS, TOAST_GROUND_OPTIONS} from 'ui-kit';

const PosBusEventsPage: FC = () => {
  const rootStore = useStore();
  const {collaborationStore, mainStore, sessionStore, spaceAdminStore} = rootStore;
  const {agoraStore, liveStreamStore, unityStore} = mainStore;
  const {agoraStageModeStore, userDevicesStore, agoraScreenShareStore} = agoraStore;
  const {
    stageModeStore,
    acceptedToJoinStageDialog,
    declinedToJoinStageDialog,
    invitedOnStageDialog,
    googleDriveStore,
    miroBoardStore
  } = collaborationStore;
  const {broadcastStore} = spaceAdminStore;
  const {space, screenShareStore} = collaborationStore;

  const history = useHistory();
  const {t} = useTranslation();

  usePosBusEvent('google-drive-file-change', (id: string) => {
    console.info('[POSBUS EVENT] google-drive-file-change', id);
    if (space?.id === id) {
      googleDriveStore.fetchGoogleDocument(id);
    }
  });

  usePosBusEvent('miro-board-change', (id: string) => {
    console.info('[POSBUS EVENT] miro-board-change', id);
    if (space?.id === id) {
      miroBoardStore.fetchMiroBoard(id);
    }
  });

  usePosBusEvent('broadcast', (broadcast: LiveStreamInterface) => {
    console.info('[POSBUS EVENT] broadcast', broadcast);
    broadcastStore.setBroadcast(broadcast);
    liveStreamStore.setBroadcast(broadcast);

    if (liveStreamStore.isStreaming) {
      history.push(generatePath(ROUTES.collaboration.liveStream, {spaceId: space?.id}));
    } else if (liveStreamStore.isLiveStreamTab) {
      history.push(generatePath(ROUTES.collaboration.dashboard, {spaceId: space?.id}));
    }
  });

  usePosBusEvent('stage-mode-invite', () => {
    console.info('[POSBUS EVENT] stage-mode-invite');
    if (!(collaborationStore.isHandlingInviteOrRequest || agoraStageModeStore.isOnStage)) {
      stageModeStore.setAcceptedRequestToJoinStage(false);
      invitedOnStageDialog.open();
    }
  });

  usePosBusEvent('stage-mode-accepted', (userId: string) => {
    console.info('[POSBUS EVENT] stage-mode-accepted', userId);
    if (userId === sessionStore.userId) {
      if (!(collaborationStore.isHandlingInviteOrRequest || agoraStageModeStore.isOnStage)) {
        stageModeStore.setAcceptedRequestToJoinStage(true);
        acceptedToJoinStageDialog.open();
      }
    }
  });

  usePosBusEvent('stage-mode-declined', (userId: string) => {
    console.info('[POSBUS EVENT] stage-mode-declined', userId);
    if (userId === sessionStore.userId) {
      declinedToJoinStageDialog.open();
    }
  });

  usePosBusEvent('posbus-connected', () => {
    console.info('[POSBUS EVENT] posbus-connected');
    if (collaborationStore.space) {
      unityStore.triggerInteractionMessage(
        PosBusEventEnum.EnteredSpace,
        collaborationStore.space.id,
        0,
        ''
      );
    }
  });

  usePosBusEvent('stage-mode-request', (userId: string) => {
    console.info('[POSBUS EVENT] stage-mode-request', userId);
    if (collaborationStore.isModerator) {
      stageModeStore.addRequestPopup(userId, {
        user: userId,
        onAccept: async () => {
          try {
            await agoraStageModeStore.requestRespond(userId, StageModeRequestEnum.ACCEPT);
            return true;
          } catch {
            toast.error(
              <ToastContent
                isDanger
                headerIconName="alert"
                title={t('titles.alert')}
                text={t('messages.userRequestDeny')}
                showCloseButton
              />
            );
            return false;
          }
        },
        onDecline: async () => {
          try {
            await agoraStageModeStore.requestRespond(userId, StageModeRequestEnum.DECLINE);
            return true;
          } catch {
            return false;
          }
        }
      });
    }
  });

  usePosBusEvent('stage-mode-toggled', async (stageModeStatus: StageModeStatusEnum) => {
    console.info('[POSBUS EVENT] stage-mode-toggled', stageModeStatus);

    // NOTE: This message should not be recieved at all when accepting invite! BE issue
    if (
      (agoraStore.isStageMode && stageModeStatus === StageModeStatusEnum.INITIATED) ||
      (!agoraStore.isStageMode && stageModeStatus === StageModeStatusEnum.STOPPED)
    ) {
      console.info('[POSBUS EVENT] Ignoring stage-mode-toggled...');
      return;
    }

    const showStageIsFull = await agoraStore.toggledStageMode(
      sessionStore.userId,
      collaborationStore.isModerator
    );

    if (showStageIsFull) {
      toast.error(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('messages.stageIsFull')}
          showCloseButton
        />,
        TOAST_GROUND_OPTIONS
      );
    }

    if (agoraStore.isStageMode) {
      toast.info(
        <ToastContent
          headerIconName="alert"
          title={t('titles.stage')}
          text={t('messages.stageModeActivated')}
          showCloseButton
        />,
        TOAST_GROUND_OPTIONS
      );
      history.push(generatePath(ROUTES.collaboration.stageMode, {spaceId: space?.id}));
    } else {
      toast.info(
        <ToastContent
          headerIconName="alert"
          title={t('titles.stage')}
          text={t('messages.stageModeDeActivated')}
          showCloseButton
        />,
        TOAST_GROUND_OPTIONS
      );
    }
  });

  usePosBusEvent('meeting-mute', () => {
    console.info('[POSBUS EVENT] meeting-mute');
    userDevicesStore.mute();
  });

  usePosBusEvent('meeting-mute-all', (moderatorId: string) => {
    console.info('[POSBUS EVENT] meeting-mute-all', moderatorId);
    if (sessionStore.userId !== moderatorId) {
      userDevicesStore.mute();
    }
  });

  usePosBusEvent('stage-mode-mute', () => {
    console.info('[POSBUS EVENT] stage-mode-mute');
    userDevicesStore.mute();

    toast.info(
      <ToastContent
        headerIconName="alert"
        title={t('titles.alert')}
        text={t('messages.stageModeMuted')}
        showCloseButton
      />,
      TOAST_GROUND_OPTIONS
    );
  });

  usePosBusEvent('meeting-kick', async () => {
    console.info('[POSBUS EVENT] meeting-kick');
    await rootStore.leaveMeetingSpace(true);
    history.push(ROUTES.base);

    toast.info(
      <ToastContent
        headerIconName="logout"
        title={t('titles.kickedFromMeeting')}
        text={t('messages.kickedFromMeeting')}
        showCloseButton
      />,
      TOAST_COMMON_OPTIONS
    );
  });

  usePosBusEvent('stage-mode-accepted', (userId: string) => {
    console.info('[POSBUS EVENT] stage-mode-accepted', userId);
    stageModeStore.removeRequestPopup(userId);
    if (userId === sessionStore.userId) {
      stageModeStore.removeAwaitingPermissionPopup();
      agoraStageModeStore.requestToGoOnstageWasHandled();
    }
  });

  usePosBusEvent('stage-mode-declined', (userId: string) => {
    console.info('[POSBUS EVENT] stage-mode-declined', userId);
    stageModeStore.removeRequestPopup(userId);
    if (userId === sessionStore.userId) {
      stageModeStore.removeAwaitingPermissionPopup();
      agoraStageModeStore.requestToGoOnstageWasHandled();
    }
  });

  usePosBusEvent('stage-mode-user-joined', (userId: string) => {
    console.info('[POSBUS EVENT] stage-mode-user-joined', userId);
    agoraStageModeStore.addBackendUser(userId);
  });

  usePosBusEvent('stage-mode-user-left', (userId: string) => {
    console.info('[POSBUS EVENT] stage-mode-user-left', userId);
    agoraStageModeStore.removeBackendUser(userId);
  });

  usePosBusEvent('stage-mode-kick', async (userId: string) => {
    console.info('[POSBUS EVENT] stage-mode-kick', userId);
    if (userId === sessionStore.userId) {
      await Promise.all([userDevicesStore.mute(), userDevicesStore.turnOffCamera()]);

      await agoraStageModeStore.leaveStage(userDevicesStore.cleanupLocalTracks);

      if (sessionStore.userId === screenShareStore.screenOwnerId) {
        agoraScreenShareStore.stopScreenSharing();
      }
    }
  });

  return null;
};

export default observer(PosBusEventsPage);
