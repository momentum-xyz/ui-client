import React, {FC, useEffect, useState} from 'react';
import {t} from 'i18next';
import {useHistory, useLocation} from 'react-router-dom';
import {toast} from 'react-toastify';
import {observer} from 'mobx-react-lite';
import ReactHowler from 'react-howler';

import {cookie} from 'core/services';
import {CookieKeyEnum} from 'core/enums';
import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {
  Avatar,
  TOAST_GROUND_OPTIONS,
  TOAST_NOT_AUTO_CLOSE_OPTIONS,
  ToastContent,
  ToolbarIcon,
  ToolbarIconInterface,
  ToolbarIconList
} from 'ui-kit';
import useCollaboration from 'context/Collaboration/hooks/useCollaboration';
import {appVariables} from 'api/constants';
import {
  COLLABORATION_CAMERA_OFF_ACTION_UPDATE,
  COLLABORATION_IS_TOGGLING_CAMERA_ACTION_UPDATE,
  COLLABORATION_IS_TOGGLING_MUTE_ACTION_UPDATE,
  COLLABORATION_MUTED_ACTION_UPDATE
} from 'context/Collaboration/CollaborationReducer';
import UnityService from 'context/Unity/UnityService';
import {switchFullscreen} from 'core/utils';
import {useGetUserOwnedSpaces} from 'modules/profile/hooks/useUserSpace';
import useInteractionHandlers from 'context/Unity/hooks/useInteractionHandlers';
import useUnityEvent from 'context/Unity/hooks/useUnityEvent';
import FooterDevTools from 'component/molucules/footer/FooterDevTools';
import {
  HelpWidget,
  LaunchInitiativeWidget,
  MagicLinkWidget,
  MusicPlayerWidget,
  ProfileMenuWidget,
  SettingsWidget,
  StakingWidget,
  TokenRuleReviewWidget,
  TokenRulesWidget,
  WorldStatsWidget
} from 'scenes/widgets/pages';
import {useAgoraStageMode} from 'hooks/communication/useAgoraStageMode';

import * as styled from './WidgetContainer.styled';

const WidgetContainer: FC = () => {
  const {
    sessionStore,
    mainStore: {worldStore, unityStore},
    widgetStore
  } = useStore();

  const {
    stakingStore,
    magicLinkStore,
    worldStatsStore,
    helpStore,
    profileMenuStore,
    tokenRulesStore,
    launchInitiativeStore,
    settingsStore,
    musicPlayerStore
  } = widgetStore;

  const {magicLinkDialog} = magicLinkStore;
  const {stakingDialog} = stakingStore;
  const {statsDialog} = worldStatsStore;
  const {profileMenuDialog} = profileMenuStore;
  const {profile: currentProfile, isGuest} = sessionStore;
  const {musicPlayerWidget, playlist, musicPlayer} = musicPlayerStore;
  const {collaborationState, collaborationDispatch} = useCollaboration();

  const history = useHistory();
  const location = useLocation();

  const getUserOwnedSpaces = useGetUserOwnedSpaces();

  const [unityWasPaused, setUnityWasPaused] = useState(false);
  const {isOnStage} = useAgoraStageMode();

  useInteractionHandlers();

  const showAddUserSpaceLater = () => {
    toast.info(
      <ToastContent
        headerIconName="people"
        title={t('titles.createSpace')}
        text={t('messages.launchInitiativeNote')}
        isCloseButton
      />,
      TOAST_GROUND_OPTIONS
    );
  };

  const showAddUserSpaceToast = () => {
    toast.info(
      <ToastContent
        headerIconName="collaboration"
        text={t('messages.launchSpaceNote')}
        title={t('titles.ownSpaceInvite')}
        declineInfo={{title: t('titles.later'), onClick: showAddUserSpaceLater}}
        approveInfo={{title: t('titles.create'), onClick: () => history.push(ROUTES.createSpace)}}
      />,
      TOAST_NOT_AUTO_CLOSE_OPTIONS
    );
  };

  const checkForUserOwnedSpaces = () => {
    if (!cookie.has(CookieKeyEnum.INITIATIVE)) {
      cookie.create(CookieKeyEnum.INITIATIVE, '1');
      getUserOwnedSpaces(worldStore.worldId).then((resp) => {
        if (resp.data.canCreate && resp.data.ownedSpaces.length === 0) {
          // Only show it for the first space
          showAddUserSpaceToast();
        }
      });
    }
  };

  useUnityEvent('TeleportReady', () => {
    if (location.pathname !== ROUTES.base) {
      if (location.pathname.indexOf('magic') === -1) {
        unityStore.pause();
      }
    } else {
      checkForUserOwnedSpaces();
    }
  });

  useEffect(() => {
    musicPlayerStore.init(worldStore.worldId);
  }, [worldStore.worldId]);

  useEffect(() => {
    // @ts-ignore: What is it for?
    const unlisten = history.listen((location) => {
      if (location.pathname === ROUTES.base) {
        checkForUserOwnedSpaces();
        unityStore.resume();
      } else {
        unityStore.pause();
      }
    });
    return function cleanup() {
      unlisten();
    };
  }, []);

  useEffect(() => {
    if (!unityStore.isPaused && stakingDialog.isOpen) {
      //if unity not paused and stakingdialog opens pause unity
      setUnityWasPaused(false);
      unityStore.pause();
    } else if (unityStore.isPaused && stakingDialog.isOpen) {
      //if unity was paused and stakingdialog opens keep track that unity was already paused
      setUnityWasPaused(true);
    } else if (!unityWasPaused && !stakingDialog.isOpen) {
      //if unity was not paused before and stakingdialog closes resume unity
      setUnityWasPaused(false);
      unityStore.resume();
    }
  }, [stakingDialog.isOpen]);

  const toggleMute = () => {
    if (collaborationState.isTogglingMute) {
      return;
    }
    collaborationDispatch({
      type: COLLABORATION_IS_TOGGLING_MUTE_ACTION_UPDATE,
      isTogglingMute: true
    });
    collaborationDispatch({
      type: COLLABORATION_MUTED_ACTION_UPDATE,
      muted: !collaborationState.muted
    });
  };

  const toggleCameraOn = () => {
    collaborationDispatch({
      type: COLLABORATION_IS_TOGGLING_CAMERA_ACTION_UPDATE,
      isTogglingCamera: true
    });
    collaborationDispatch({
      type: COLLABORATION_CAMERA_OFF_ACTION_UPDATE,
      cameraOff: !collaborationState.cameraOff
    });
  };

  const handleRuleReviewClose = () => {
    tokenRulesStore.tokenRuleReviewDialog.close();
    tokenRulesStore.tokenRulesListStore.fetchTokenRules();
  };

  const mainToolbarIcons: ToolbarIconInterface[] = [
    {title: t('labels.worldStats'), icon: 'stats', onClick: statsDialog.open},
    {
      title: t('labels.calendar'),
      icon: 'calendar',
      link: location.pathname === '/calendar' ? ROUTES.base : ROUTES.worldCalendar
    },
    {title: t('labels.minimap'), icon: 'minimap', onClick: () => UnityService.toggleMiniMap()},
    {
      title: t('labels.musicPlayer'),
      icon: 'music',
      onClick: musicPlayerWidget.toggle
    },
    {title: t('labels.shareLocation'), icon: 'location', onClick: magicLinkDialog.open},
    {title: t('labels.help'), icon: 'question', onClick: helpStore.helpDialog.open},
    {title: t('labels.fullscreen'), icon: 'fullscreen', onClick: switchFullscreen}
  ];

  return (
    <>
      {worldStatsStore.statsDialog.isOpen && <WorldStatsWidget />}
      {stakingStore.stakingDialog.isOpen && <StakingWidget />}
      {magicLinkStore.magicLinkDialog.isOpen && <MagicLinkWidget />}
      {helpStore.helpDialog.isOpen && <HelpWidget />}
      {profileMenuStore.profileMenuDialog.isOpen && <ProfileMenuWidget />}
      {tokenRulesStore.widgetDialog.isOpen && <TokenRulesWidget />}
      {musicPlayerStore.musicPlayerWidget.isOpen && <MusicPlayerWidget />}
      {tokenRulesStore.tokenRuleReviewDialog.isOpen && (
        <TokenRuleReviewWidget
          onClose={handleRuleReviewClose}
          tokenRuleReviewStore={tokenRulesStore.tokenRuleReviewStore}
        />
      )}
      {launchInitiativeStore.dialog.isOpen && <LaunchInitiativeWidget />}
      {settingsStore.dialog.isOpen && <SettingsWidget />}
      <ReactHowler
        src={[playlist.currentTrackHash]}
        onLoad={musicPlayer.startLoading}
        format={['mp3', 'ogg', 'acc', 'webm']}
        onPlay={musicPlayer.startedPlaying}
        onEnd={musicPlayerStore.songEnded}
        playing={musicPlayer.isPlaying}
        preload={true}
        loop={false}
        mute={musicPlayer.muted}
        volume={musicPlayer.volume}
        html5={true}
        ref={(ref) => musicPlayer.setPlayer(ref)}
      />
      <styled.Footer>
        <styled.MainLinks>
          <ToolbarIcon icon="home" title="Home" link={ROUTES.base} size="large" exact />
        </styled.MainLinks>
        <styled.Toolbars>
          {process.env.NODE_ENV === 'development' && <FooterDevTools />}
          <ToolbarIconList>
            <ToolbarIcon
              title={
                collaborationState.stageMode && !isOnStage
                  ? 'You are in the audience, stage mode is on'
                  : collaborationState.cameraOff
                  ? 'Camera on'
                  : 'Camera off'
              }
              icon={collaborationState.cameraOff ? 'cameraOff' : 'cameraOn'}
              onClick={toggleCameraOn}
              disabled={
                collaborationState.isTogglingCamera || (collaborationState.stageMode && !isOnStage)
              }
            />
            <ToolbarIcon
              title={
                collaborationState.stageMode && !isOnStage
                  ? 'You are in the audience, stage mode is on'
                  : collaborationState.muted
                  ? 'Unmute'
                  : 'Mute'
              }
              icon={collaborationState.muted ? 'microphoneOff' : 'microphoneOn'}
              onClick={toggleMute}
              disabled={
                collaborationState.isTogglingMute || (collaborationState.stageMode && !isOnStage)
              }
            />
          </ToolbarIconList>
          {/* Main toolbar icons */}
          <ToolbarIconList>
            {currentProfile?.profile && (
              <ToolbarIcon title="Profile" onClick={profileMenuDialog.open}>
                <Avatar
                  status={sessionStore.profile?.status}
                  size="extra-small"
                  avatarSrc={
                    currentProfile.profile.avatarHash &&
                    `${appVariables.RENDER_SERVICE_URL}/get/${currentProfile.profile.avatarHash}`
                  }
                  showBorder
                  showHover
                />
              </ToolbarIcon>
            )}
            {!isGuest && (
              <ToolbarIcon
                title={t('labels.staking')}
                icon="wallet"
                onClick={() => {
                  stakingStore.setOperatorSpaceId('');
                  stakingDialog.open();
                }}
              />
            )}
            {mainToolbarIcons.map((item) => (
              <ToolbarIcon key={item.title} {...item} />
            ))}
          </ToolbarIconList>
        </styled.Toolbars>
      </styled.Footer>
    </>
  );
};

export default observer(WidgetContainer);
