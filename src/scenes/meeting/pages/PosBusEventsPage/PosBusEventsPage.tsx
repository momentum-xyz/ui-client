import {observer} from 'mobx-react-lite';
import {FC} from 'react';
import {generatePath, useHistory} from 'react-router-dom';
import {toast} from 'react-toastify';
import {useTranslation} from 'react-i18next';

import {PosBusEventEnum, StageModeRequestEnum} from 'core/enums';
import {ROUTES} from 'core/constants';
import {LiveStreamInterface} from 'api';
import {usePosBusEvent, useStore} from 'shared/hooks';
import {ToastContent, TOAST_COMMON_OPTIONS, TOAST_GROUND_OPTIONS} from 'ui-kit';

const PosBusEventsPage: FC = () => {
  const rootStore = useStore();
  const {collaborationStore, mainStore, sessionStore, spaceAdminStore} = rootStore;
  const {agoraStore, unityStore} = mainStore;
  const {agoraStageModeStore, userDevicesStore} = agoraStore;
  const {
    stageModeStore,
    acceptedToJoinStageDialog,
    declinedToJoinStageDialog,
    invitedOnStageDialog,
    liveStreamStore,
    googleDriveStore,
    miroBoardStore
  } = collaborationStore;
  const {broadcastStore} = spaceAdminStore;
  const {space} = collaborationStore;

  const history = useHistory();
  const {t} = useTranslation();

  usePosBusEvent('google-drive-file-change', (id) => {
    if (space?.id === id) {
      googleDriveStore.fetchGoogleDocument(id);
    }
  });

  usePosBusEvent('miro-board-change', (id) => {
    if (space?.id === id) {
      miroBoardStore.fetchMiroBoard(id);
    }
  });

  usePosBusEvent('broadcast', (broadcast: LiveStreamInterface) => {
    broadcastStore.setBroadcast(broadcast);
  });

  usePosBusEvent('stage-mode-invite', () => {
    if (!(collaborationStore.isHandlingInviteOrRequest || agoraStageModeStore.isOnStage)) {
      invitedOnStageDialog.open();
      stageModeStore.setAcceptedRequestToJoinStage(false);
    }
  });

  usePosBusEvent('stage-mode-accepted', (userId) => {
    if (userId === sessionStore.userId) {
      if (!(collaborationStore.isHandlingInviteOrRequest || agoraStageModeStore.isOnStage)) {
        acceptedToJoinStageDialog.open();
        stageModeStore.setAcceptedRequestToJoinStage(true);
      }
    }
  });

  usePosBusEvent('stage-mode-declined', (userId) => {
    if (userId === sessionStore.userId) {
      declinedToJoinStageDialog.open();
    }
  });

  usePosBusEvent('posbus-connected', () => {
    if (collaborationStore.space) {
      unityStore.triggerInteractionMessage(
        PosBusEventEnum.EnteredSpace,
        collaborationStore.space.id,
        0,
        ''
      );
    }
  });

  usePosBusEvent('stage-mode-request', (userId) => {
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
                isCloseButton
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

  usePosBusEvent('broadcast', (broadcast: LiveStreamInterface) => {
    liveStreamStore.setBroadcast(broadcast);

    if (liveStreamStore.isStreaming) {
      history.push(generatePath(ROUTES.collaboration.liveStream, {spaceId: space?.id}));
    } else {
      history.push(generatePath(ROUTES.collaboration.dashboard, {spaceId: space?.id}));
    }
  });

  usePosBusEvent('stage-mode-toggled', async (stageModeStatus) => {
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
          isCloseButton
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
          isCloseButton
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
          isCloseButton
        />,
        TOAST_GROUND_OPTIONS
      );
    }
  });

  usePosBusEvent('meeting-mute', () => {
    userDevicesStore.mute();
  });

  usePosBusEvent('meeting-mute-all', (moderatorId) => {
    if (sessionStore.userId !== moderatorId) {
      userDevicesStore.mute();
    }
  });

  usePosBusEvent('stage-mode-mute', () => {
    userDevicesStore.mute();

    toast.info(
      <ToastContent
        headerIconName="alert"
        title={t('titles.alert')}
        text={t('messages.stageModeMuted')}
        isCloseButton
      />,
      TOAST_GROUND_OPTIONS
    );
  });

  usePosBusEvent('meeting-kick', async () => {
    await rootStore.leaveMeetingSpace(true);
    history.push(ROUTES.base);

    toast.info(
      <ToastContent
        headerIconName="logout"
        title={t('titles.kickedFromMeeting')}
        text={t('messages.kickedFromMeeting')}
        isCloseButton
      />,
      TOAST_COMMON_OPTIONS
    );
  });

  usePosBusEvent('stage-mode-accepted', (userId) => {
    stageModeStore.removeRequestPopup(userId);
    if (userId === sessionStore.userId) {
      stageModeStore.removeAwaitingPermissionPopup();
      agoraStageModeStore.requestToGoOnstageWasHandled();
    }
  });

  usePosBusEvent('stage-mode-declined', (userId) => {
    stageModeStore.removeRequestPopup(userId);
    if (userId === sessionStore.userId) {
      stageModeStore.removeAwaitingPermissionPopup();
      agoraStageModeStore.requestToGoOnstageWasHandled();
    }
  });

  usePosBusEvent('stage-mode-user-joined', agoraStageModeStore.addStageModeUser);
  usePosBusEvent('stage-mode-user-left', agoraStageModeStore.removeStageModeUser);
  usePosBusEvent('stage-mode-kick', agoraStageModeStore.moveToAudience);

  return null;
};

export default observer(PosBusEventsPage);
