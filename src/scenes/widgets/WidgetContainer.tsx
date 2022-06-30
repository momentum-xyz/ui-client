import React, {FC, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import ReactHowler from 'react-howler';
import {t} from 'i18next';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {appVariables} from 'api/constants';
import {switchFullscreen} from 'core/utils';
import {UnityService} from 'shared/services';
import {Avatar, ToolbarIcon, ToolbarIconInterface, ToolbarIconList} from 'ui-kit';
import {
  AttendeesWidget,
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
// TODO: Refactoring
import {
  COLLABORATION_CAMERA_OFF_ACTION_UPDATE,
  COLLABORATION_IS_TOGGLING_CAMERA_ACTION_UPDATE,
  COLLABORATION_IS_TOGGLING_MUTE_ACTION_UPDATE,
  COLLABORATION_MUTED_ACTION_UPDATE
} from 'context/Collaboration/CollaborationReducer';
import useCollaboration from 'context/Collaboration/hooks/useCollaboration';
import useInteractionHandlers from 'context/Unity/hooks/useInteractionHandlers';
import FooterDevTools from 'component/molucules/footer/FooterDevTools';
import {useAgoraStageMode} from 'hooks/communication/useAgoraStageMode';

import * as styled from './WidgetContainer.styled';

const WidgetContainer: FC = () => {
  const {sessionStore, mainStore, widgetStore} = useStore();
  const {worldStore} = mainStore;
  const {
    stakingStore,
    magicLinkStore,
    worldStatsStore,
    helpStore,
    profileMenuStore,
    tokenRulesStore,
    launchInitiativeStore,
    settingsStore,
    musicPlayerStore,
    attendeesListStore
  } = widgetStore;
  const {magicLinkDialog} = magicLinkStore;
  const {stakingDialog} = stakingStore;
  const {statsDialog} = worldStatsStore;
  const {profileMenuDialog} = profileMenuStore;
  const {profile: currentProfile, isGuest} = sessionStore;
  const {musicPlayerWidget, playlist, musicPlayer} = musicPlayerStore;
  const {collaborationState, collaborationDispatch} = useCollaboration();

  const location = useLocation();
  const {isOnStage} = useAgoraStageMode();

  useInteractionHandlers();

  useEffect(() => {
    musicPlayerStore.init(worldStore.worldId);
  }, [musicPlayerStore, worldStore.worldId]);

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
      {attendeesListStore.dialog.isOpen && <AttendeesWidget />}
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
