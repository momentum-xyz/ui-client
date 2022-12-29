import React, {FC, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import ReactHowler from 'react-howler';
import {Avatar, ToolbarIcon, ToolbarIconInterface, ToolbarIconList} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {switchFullscreen} from 'core/utils';
import {
  HelpWidget,
  LaunchInitiativeWidget,
  MusicPlayerWidget,
  StakingWidget,
  WorldStatsWidget,
  StageModePIPWidget,
  EmojiWidget,
  LiveStreamPIPWidget
} from 'scenes/widgets_OLD/pages';

import * as styled from './Widgets_OLD.styled';

const Widgets_OLD: FC = () => {
  const {
    sessionStore,
    mainStore,
    widgetStore_OLD,
    flightStore,
    odysseyCreatorStore: worldBuilderStore
  } = useStore();
  const {worldStore, agoraStore, unityStore} = mainStore;
  const {agoraStageModeStore} = agoraStore;
  const {
    stakingStore,
    worldStatsStore,
    helpStore,
    launchInitiativeStore,
    musicPlayerStore,
    emojiStore
  } = widgetStore_OLD;
  const {stakingDialog} = stakingStore;
  const {statsDialog} = worldStatsStore;
  const {user, userId} = sessionStore;
  const {musicPlayerWidget, playlist, musicPlayer} = musicPlayerStore;
  const {userDevicesStore} = agoraStore;

  const {t} = useTranslation();
  const location = useLocation();

  useEffect(() => {
    musicPlayerStore.init(worldStore.worldId);
    emojiStore.init(worldStore.worldId);
    worldBuilderStore.fetchPermissions();
  }, [userId, user, worldStore.worldId, musicPlayerStore, emojiStore, worldBuilderStore]);

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
      // link: location.pathname === '/calendar' ? ROUTES.base : ROUTES.calendar,
      disabled: flightStore.isFlightWithMe
    },
    {
      title: t('labels.minimap'),
      icon: 'minimap',
      onClick: () => unityStore.toggleMiniMap(),
      disabled: flightStore.isFlightWithMe
    },
    {
      title: t('labels.musicPlayer'),
      icon: 'music',
      onClick: musicPlayerWidget.toggle
    },
    {title: t('labels.help'), icon: 'question', onClick: helpStore.helpDialog.open},
    {title: t('labels.fullscreen'), icon: 'fullscreen', onClick: switchFullscreen}
  ];

  return (
    <>
      {worldStatsStore.statsDialog.isOpen && <WorldStatsWidget />}
      {stakingStore.stakingDialog.isOpen && <StakingWidget />}
      {helpStore.helpDialog.isOpen && <HelpWidget />}
      {musicPlayerStore.musicPlayerWidget.isOpen && <MusicPlayerWidget />}
      {launchInitiativeStore.dialog.isOpen && <LaunchInitiativeWidget />}
      {!location.pathname.includes('stage-mode') && <StageModePIPWidget />}
      {!location.pathname.includes('live-stream') && <LiveStreamPIPWidget />}
      {emojiStore.selectionDialog.isOpen && (
        <styled.EmojiBar>
          <EmojiWidget onClose={emojiStore.selectionDialog.close} />
        </styled.EmojiBar>
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
      <styled.Footer data-testid="Widgets_OLD-test">
        <styled.MainLinks>
          <ToolbarIcon
            icon="smiley-face"
            title={t('actions.react')}
            onClick={emojiStore.selectionDialog.toggle}
            size="normal-large"
            isWhite={false}
          />

          {(worldBuilderStore.haveAccess || true) && ( // TODO: remove this line when we have permissions
            <ToolbarIcon
              icon="planet"
              title={t('titles.worldBuilder')}
              //link={ROUTES.worldBuilder.builder}
              size="normal-large"
              isWhite={false}
            />
          )}
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
            {user?.profile && (
              <ToolbarIcon
                title={t('titles.profile')} /*onClick={profileMenuStore.openProfileMenu}*/
              >
                <Avatar
                  size="extra-small"
                  status={user.status}
                  avatarSrc={user.avatarSrc}
                  showBorder
                  showHover
                />
              </ToolbarIcon>
            )}
            {!sessionStore.user?.isGuest && (
              <ToolbarIcon
                title={t('labels.staking')}
                icon="wallet"
                disabled={flightStore.isFlightWithMe}
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

export default observer(Widgets_OLD);
