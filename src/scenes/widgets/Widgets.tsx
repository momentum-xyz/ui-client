import React, {FC, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import ReactHowler from 'react-howler';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
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
  StakingWidget,
  WorldStatsWidget,
  StageModePIPWidget,
  EmojiWidget,
  LiveStreamPIPWidget
} from 'scenes/widgets/pages';

import * as styled from './Widgets.styled';
import {AvatarForm} from './pages/ProfileWidget/components';
import WorldChatWidget from './pages/WorldChatWidget/WorldChatWidget';

const Widgets: FC = () => {
  const {sessionStore, mainStore, widgetStore, worldChatStore} = useStore();
  const {worldStore, liveStreamStore, agoraStore} = mainStore;
  const {agoraStageModeStore} = agoraStore;
  const {
    stakingStore,
    magicLinkStore,
    worldStatsStore,
    helpStore,
    profileMenuStore,
    launchInitiativeStore,
    musicPlayerStore,
    attendeesListStore,
    profileStore,
    emojiStore
  } = widgetStore;
  const {magicLinkDialog} = magicLinkStore;
  const {stakingDialog} = stakingStore;
  const {statsDialog} = worldStatsStore;
  const {profile: currentProfile, isGuest, userId} = sessionStore;
  const {musicPlayerWidget, playlist, musicPlayer} = musicPlayerStore;
  const {userDevicesStore} = agoraStore;

  const {t} = useTranslation();
  const location = useLocation();

  useEffect(() => {
    musicPlayerStore.init(worldStore.worldId);
    emojiStore.init(worldStore.worldId);
    worldChatStore.init(userId, worldStore.worldId, currentProfile ?? undefined);
  }, [musicPlayerStore, emojiStore, worldStore.worldId, userId, currentProfile, worldChatStore]);

  const toggleMute = () => {
    if (!agoraStore.canToggleMicrophone) {
      return;
    }

    userDevicesStore.toggleMicrophone();
  };

  const toggleCameraOn = () => {
    if (!agoraStore.canToggleCamera) {
      return;
    }

    userDevicesStore.toggleCamera();
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
      {profileStore.editAvatarDialog.isOpen && <AvatarForm />}
      {worldStatsStore.statsDialog.isOpen && <WorldStatsWidget />}
      {stakingStore.stakingDialog.isOpen && <StakingWidget />}
      {magicLinkStore.magicLinkDialog.isOpen && <MagicLinkWidget />}
      {helpStore.helpDialog.isOpen && <HelpWidget />}
      {profileMenuStore.profileMenuDialog.isOpen && <ProfileMenuWidget />}
      {musicPlayerStore.musicPlayerWidget.isOpen && <MusicPlayerWidget />}
      {launchInitiativeStore.dialog.isOpen && <LaunchInitiativeWidget />}
      {attendeesListStore.dialog.isOpen && <AttendeesWidget />}
      {!location.pathname.includes('stage-mode') && <StageModePIPWidget />}
      {!location.pathname.includes('live-stream') && (
        <LiveStreamPIPWidget
          youtubeHash={liveStreamStore.broadcast.url}
          spaceName={liveStreamStore.spaceName}
          showWidget={liveStreamStore.showLiveStream}
          hideWidget={liveStreamStore.hideWidget}
          flyAround={!location.pathname.includes('collaboration')}
        />
      )}
      {emojiStore.selectionDialog.isOpen && (
        <styled.EmojiBar>
          <EmojiWidget onClose={emojiStore.selectionDialog.close} />
        </styled.EmojiBar>
      )}
      {worldChatStore.textChatDialog.isOpen && (
        <WorldChatWidget onClose={worldChatStore.textChatDialog.close} />
      )}
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
      <styled.Footer data-testid="Widgets-test">
        <styled.MainLinks>
          <ToolbarIcon
            icon="smiley-face"
            title={t('actions.react')}
            onClick={emojiStore.selectionDialog.toggle}
            size="normal-large"
            isWhite={false}
          />
          <styled.ChatIconWrapper>
            <ToolbarIcon
              icon="chat"
              title={
                worldChatStore.textChatDialog.isOpen
                  ? t('tooltipTitles.closeChat')
                  : t('tooltipTitles.openChat')
              }
              onClick={worldChatStore.textChatDialog.toggle}
              size="normal-large"
              isWhite={false}
            >
              {worldChatStore.numberOfUnreadMessages > 0 && (
                <styled.MessageCount>{worldChatStore.numberOfUnreadMessages}</styled.MessageCount>
              )}
            </ToolbarIcon>
          </styled.ChatIconWrapper>
        </styled.MainLinks>
        <styled.Toolbars>
          <ToolbarIconList>
            <ToolbarIcon
              title={
                agoraStore.isStageMode && !agoraStageModeStore.isOnStage
                  ? t('messages.youAreInAudience')
                  : userDevicesStore.cameraOff
                  ? t('labels.cameraOn')
                  : t('labels.cameraOff')
              }
              icon={userDevicesStore.cameraOff ? 'cameraOff' : 'cameraOn'}
              onClick={toggleCameraOn}
              disabled={!agoraStore.canToggleCamera}
            />
            <ToolbarIcon
              title={
                agoraStore.isStageMode && !agoraStageModeStore.isOnStage
                  ? t('messages.youAreInAudience')
                  : userDevicesStore.muted
                  ? t('actions.unmute')
                  : t('actions.mute')
              }
              icon={userDevicesStore.muted ? 'microphoneOff' : 'microphoneOn'}
              onClick={toggleMute}
              disabled={!agoraStore.canToggleMicrophone}
            />
          </ToolbarIconList>
          {/* Main toolbar icons */}
          <ToolbarIconList>
            {currentProfile?.profile && (
              <ToolbarIcon title={t('titles.profile')} onClick={profileMenuStore.openProfileMenu}>
                <Avatar
                  size="extra-small"
                  status={sessionStore.profile?.status}
                  avatarSrc={currentProfile.avatarSrc}
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
              <ToolbarIcon key={item.title} {...item} state={{canGoBack: true}} />
            ))}
          </ToolbarIconList>
        </styled.Toolbars>
      </styled.Footer>
    </>
  );
};

export default observer(Widgets);
