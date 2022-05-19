import React, {FC, useEffect, useState} from 'react';
import {t} from 'i18next';
import {useHistory, useLocation} from 'react-router-dom';
import {toast} from 'react-toastify';
import {observer} from 'mobx-react-lite';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {
  Avatar,
  ToolbarIcon,
  ToastContent,
  ToolbarIconInterface,
  ToolbarIconList,
  TOAST_GROUND_OPTIONS,
  TOAST_NOT_AUTO_CLOSE_OPTIONS
} from 'ui-kit';
import useCollaboration from 'context/Collaboration/hooks/useCollaboration';
import {endpoints} from 'api/constants';
import {
  COLLABORATION_IS_TOGGLING_MUTE_ACTION_UPDATE,
  COLLABORATION_MUTED_ACTION_UPDATE,
  COLLABORATION_IS_TOGGLING_CAMERA_ACTION_UPDATE,
  COLLABORATION_CAMERA_OFF_ACTION_UPDATE
} from 'context/Collaboration/CollaborationReducer';
import UnityService from 'context/Unity/UnityService';
import {createCookieInHours, hasCookie, switchFullscreen} from 'core/utils';
import {useMusicPlayer} from 'context/MusicPlayer/hooks/useMusicPlayer';
import {useGetUserOwnedSpaces} from 'modules/profile/hooks/useUserSpace';
import useInteractionHandlers from 'context/Unity/hooks/useInteractionHandlers';
import useUnityEvent from 'context/Unity/hooks/useUnityEvent';
import FooterDevTools from 'component/molucules/footer/FooterDevTools';
import {
  StakingWidget,
  HelpWidget,
  MagicLinkWidget,
  ProfileMenuWidget,
  TokenRulesWidget,
  TokenRuleReviewWidget,
  WorldStatsWidget,
  LaunchInitiativeWidget,
  SettingsWidget
} from 'scenes/widgets/pages';
import {UserStatusEnum} from 'core/enums';

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
    settingsStore
  } = widgetStore;

  const {magicLinkDialog} = magicLinkStore;
  const {stakingDialog} = stakingStore;
  const {statsDialog} = worldStatsStore;
  const {profileMenuDialog} = profileMenuStore;
  const {profile: currentProfile, isGuest} = sessionStore;

  const {collaborationState, collaborationDispatch} = useCollaboration();
  const {handleMusicPlayer, show} = useMusicPlayer();

  const history = useHistory();
  const location = useLocation();

  const getUserOwnedSpaces = useGetUserOwnedSpaces();

  const [unityWasPaused, setUnityWasPaused] = useState(false);

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
    if (!hasCookie('CREATE_INITIATIVE_SHOWN')) {
      createCookieInHours('CREATE_INITIATIVE_SHOWN', '1', 1);
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

  const handleMusicPlayerStatus = () => {
    handleMusicPlayer(!show);
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
    {title: t('labels.musicPlayer'), icon: 'music', onClick: handleMusicPlayerStatus},
    {title: t('labels.shareLocation'), icon: 'location', onClick: magicLinkDialog.open},
    {title: t('labels.information'), icon: 'question', onClick: helpStore.helpDialog.open},
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
      {tokenRulesStore.tokenRuleReviewDialog.isOpen && (
        <TokenRuleReviewWidget
          onClose={handleRuleReviewClose}
          tokenRuleReviewStore={tokenRulesStore.tokenRuleReviewStore}
        />
      )}
      {launchInitiativeStore.dialog.isOpen && <LaunchInitiativeWidget />}
      {settingsStore.dialog.isOpen && <SettingsWidget />}

      <styled.Footer>
        <styled.MainLinks>
          <ToolbarIcon icon="home" title="Home" link={ROUTES.base} size="large" exact />
          <ToolbarIcon
            title="Collaboration"
            size="large"
            link={ROUTES.collaboration}
            icon="collaboration"
            animate
            visible={!!collaborationState.collaborationSpace}
            isActive={(match, location) => {
              return location.pathname.includes(ROUTES.collaboration);
            }}
          />
        </styled.MainLinks>
        <styled.Toolbars>
          {process.env.NODE_ENV === 'development' && <FooterDevTools />}
          <ToolbarIconList>
            <ToolbarIcon
              title={collaborationState.cameraOff ? 'Camera on' : 'Camera off'}
              icon={collaborationState.cameraOff ? 'cameraOff' : 'cameraOn'}
              onClick={toggleCameraOn}
              disabled={collaborationState.isTogglingCamera}
            />
            <ToolbarIcon
              title={collaborationState.muted ? 'Unmute' : 'Mute'}
              icon={collaborationState.muted ? 'microphoneOff' : 'microphoneOn'}
              onClick={toggleMute}
              disabled={
                collaborationState.isTogglingMute ||
                (collaborationState.isLoading && !collaborationState.stageMode)
              }
            />
          </ToolbarIconList>
          {/* Main toolbar icons */}
          <ToolbarIconList>
            {currentProfile?.profile && (
              <ToolbarIcon title="Profile" onClick={profileMenuDialog.open}>
                <Avatar
                  status={UserStatusEnum.ONLINE}
                  size="extra-small"
                  avatarSrc={
                    currentProfile.profile.avatarHash &&
                    `${endpoints.renderService}/get/${currentProfile.profile.avatarHash}`
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
