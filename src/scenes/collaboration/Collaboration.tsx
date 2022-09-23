import React, {FC, useCallback, useEffect} from 'react';
import {generatePath, Route, Switch, useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {observer, useObserver} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {useTheme} from 'styled-components';

import {ROUTES} from 'core/constants';
import {PrivateSpaceError} from 'core/errors';
import {createRoutesByConfig} from 'core/utils';
import {useStore, useDeviceChange} from 'shared/hooks';
import {StageModeRequestEnum} from 'core/enums';
import {
  Navigation,
  ToastContent,
  TOAST_GROUND_OPTIONS,
  NewDeviceDialog,
  CountdownDialog
} from 'ui-kit';
import {request} from 'api/request';
import {NavigationTabInterface} from 'core/interfaces';

import {
  AcceptedToJoinStageDialog,
  DeclinedToJoinStageDialog,
  InvitedOnStageDialog,
  PrepareOnStageDialog
} from './pages/StageModePage/components';
import {EmojiAnimationDock} from './components';
import {COLLABORATION_ROUTES, buildNavigationTabs} from './Collaboration.routes';
import * as styled from './Collaboration.styled';
import {CollaborationPluginPage} from './pages';

const Collaboration: FC = () => {
  const rootStore = useStore();
  const {collaborationStore, mainStore, sessionStore} = rootStore;
  const {agoraStore} = mainStore;
  const {agoraScreenShareStore, agoraStageModeStore, userDevicesStore} = agoraStore;
  const {
    newDeviceDialog,
    acceptedToJoinStageDialog,
    declinedToJoinStageDialog,
    invitedOnStageDialog,
    prepareOnStageDialog,
    countdownDialog,
    textChatStore,
    liveStreamStore,
    stageModeStore,
    space,
    pluginsStore
  } = collaborationStore;

  const {spaceId} = useParams<{spaceId: string}>();
  const {t} = useTranslation();
  const history = useHistory();
  const theme = useTheme();

  const reJoinMeeting = useCallback(async () => {
    if (agoraStore.hasJoined && agoraStore.spaceId === spaceId) {
      return;
    }

    if (agoraStore.hasJoined && agoraStore.spaceId !== spaceId) {
      await rootStore.leaveMeetingSpace();
    }

    rootStore
      .joinMeetingSpace(spaceId, false)
      .then(() => {
        if (!textChatStore.isLoggedOn) {
          textChatStore.init(agoraStore.appId, sessionStore.userId, spaceId);
        }
      })
      .catch((e) => {
        if (e instanceof PrivateSpaceError) {
          history.push(ROUTES.base);
          toast.error(
            <ToastContent
              isDanger
              showCloseButton
              headerIconName="alert"
              title={t('titles.alert')}
              text={t('collaboration.spaceIsPrivate')}
            />
          );
        }
      });
  }, [agoraStore, history, rootStore, sessionStore, spaceId, t, textChatStore]);

  useEffect(() => {
    pluginsStore.init(theme, space?.isAdmin ?? false, spaceId);
    console.info('fetched plugin list', pluginsStore.plugins.length);
  }, [history, pluginsStore, space?.isAdmin, spaceId, theme]);

  useEffect(() => {
    reJoinMeeting().then();
  }, [reJoinMeeting, spaceId]);

  useEffect(() => {
    collaborationStore.initBroadcast(spaceId);
  }, [collaborationStore, spaceId]);

  useEffect(() => {
    textChatStore.countUnreadMessages();
  }, [textChatStore.messageSent, textChatStore.textChatDialog.isOpen, textChatStore]);

  const handleCountdownEnded = useCallback(async () => {
    if (agoraStageModeStore.isStageFull) {
      toast.error(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('messages.stageModeFull')}
          showCloseButton
        />,
        TOAST_GROUND_OPTIONS
      );
      countdownDialog.close();
      return;
    }

    if (!stageModeStore.acceptedRequestToJoinStage) {
      try {
        await agoraStageModeStore.invitationRespond(StageModeRequestEnum.ACCEPT);
        await agoraStageModeStore.enterStage(userDevicesStore.createLocalTracks);
      } catch {
        toast.error(
          <ToastContent
            isDanger
            headerIconName="alert"
            title={t('titles.alert')}
            text={t('messages.joinStageRefused')}
            showCloseButton
          />
        );
      } finally {
        countdownDialog.close();
      }
    } else if (stageModeStore.acceptedRequestToJoinStage) {
      try {
        await agoraStageModeStore.enterStage(userDevicesStore.createLocalTracks);
        countdownDialog.close();
      } catch {
        toast.error(
          <ToastContent
            isDanger
            headerIconName="alert"
            title={t('titles.alert')}
            text={t('messages.joinStageRefused')}
            showCloseButton
          />
        );
      }
    }

    stageModeStore.setAcceptedRequestToJoinStage(undefined);
  }, [agoraStageModeStore, countdownDialog, stageModeStore, t, userDevicesStore.createLocalTracks]);

  const handleCountdownCanceled = () => {
    countdownDialog.close();
    prepareOnStageDialog.close();
  };

  const handleInviteDeclined = useCallback(async () => {
    await agoraStageModeStore.invitationRespond(StageModeRequestEnum.DECLINE);
    invitedOnStageDialog.close();
  }, [agoraStageModeStore, invitedOnStageDialog]);

  const {device} = useDeviceChange(newDeviceDialog.open);

  const tabs = useObserver(() => {
    const pluginTabs: NavigationTabInterface[] = pluginsStore.plugins.map((plugin) => ({
      path: generatePath(ROUTES.collaboration.plugin, {spaceId, subPath: plugin.subPath}),
      iconName: plugin.iconName
    }));

    return [
      ...buildNavigationTabs(
        spaceId,
        agoraStore.isStageMode,
        !!agoraScreenShareStore.videoTrack,
        liveStreamStore.isStreaming
      ),
      ...pluginTabs
    ];
  });

  return (
    <styled.Container>
      <Navigation tabs={tabs} />

      <Switch>
        {createRoutesByConfig(COLLABORATION_ROUTES)}
        {pluginsStore.plugins.map((plugin) => {
          return (
            <Route
              key={generatePath(ROUTES.collaboration.plugin, {subPath: plugin.subPath, spaceId})}
              path={generatePath(ROUTES.collaboration.plugin, {subPath: plugin.subPath, spaceId})}
              exact={plugin.exact}
            >
              <CollaborationPluginPage plugin={plugin} request={request} />
            </Route>
          );
        })}
      </Switch>

      {newDeviceDialog.isOpen && (
        <NewDeviceDialog
          onClose={newDeviceDialog.close}
          deviceKindDescription={device && t(`labels.${device.kind}`).toLowerCase()}
          deviceLabel={device?.label}
          currentAudioDeviceId={userDevicesStore.currentAudioInput?.deviceId}
          currentVideoDeviceId={userDevicesStore.currentVideoInput?.deviceId}
          audioDevices={userDevicesStore.audioInputOptions}
          videoDevices={userDevicesStore.videoInputsOption}
          onAudioDeviceSelect={userDevicesStore.selectAudioInput}
          onVideoDeviceSelect={userDevicesStore.selectVideoInput}
        />
      )}
      {acceptedToJoinStageDialog.isOpen && (
        <AcceptedToJoinStageDialog
          onReady={prepareOnStageDialog.open}
          onDecline={acceptedToJoinStageDialog.close}
          onClose={acceptedToJoinStageDialog.close}
        />
      )}
      {countdownDialog.isOpen && (
        <CountdownDialog
          title={t('titles.goingOnStage')}
          onSave={handleCountdownEnded}
          onClose={handleCountdownCanceled}
        />
      )}
      {declinedToJoinStageDialog.isOpen && (
        <DeclinedToJoinStageDialog onClose={declinedToJoinStageDialog.close} />
      )}
      {invitedOnStageDialog.isOpen && (
        <InvitedOnStageDialog
          onClose={invitedOnStageDialog.close}
          onGetReady={prepareOnStageDialog.open}
          onDecline={handleInviteDeclined}
        />
      )}
      {prepareOnStageDialog.isOpen && (
        <PrepareOnStageDialog onClose={prepareOnStageDialog.close} onReady={countdownDialog.open} />
      )}

      <styled.BottomCenteredDock>
        <EmojiAnimationDock />
      </styled.BottomCenteredDock>
    </styled.Container>
  );
};

export default observer(Collaboration);
