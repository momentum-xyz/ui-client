import React, {FC, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import ReactHowler from 'react-howler';
import {Avatar, ToolbarIcon, ToolbarIconInterface, ToolbarIconList} from '@momentum-xyz/ui-kit';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';

import * as styled from './Widgets.styled';
import {OnlineUsersWidget} from './pages/OnlineUsersWidget';
import {ScreenSharePage} from './pages';

const Widgets: FC = () => {
  const {sessionStore, widgetStore, widgetsStore, flightStore, mainStore, worldBuilderStore} =
    useStore();
  const {unityStore} = mainStore;
  const {profileMenuStore, musicPlayerStore} = widgetStore;
  const {screenShareStore} = widgetsStore;
  const {user} = sessionStore;
  const {playlist, musicPlayer} = musicPlayerStore;

  const {t} = useTranslation();
  const location = useLocation();

  useEffect(() => {
    worldBuilderStore.fetchPermissions();
    unityStore.hideMinimap();
  }, [unityStore, worldBuilderStore]);

  const rightToolbarIcons: ToolbarIconInterface[] = [
    {
      title: t('labels.screenShare'),
      icon: 'screenshare',
      size: 'medium',
      onClick: () => {
        console.info('here');
        screenShareStore.widget.open();
      }
    },
    {
      title: t('labels.calendar'),
      icon: 'calendar',
      size: 'medium',
      link: location.pathname === '/calendar' ? ROUTES.base : ROUTES.calendar,
      disabled: flightStore.isFlightWithMe
    },
    {
      title: t('labels.worldChat'),
      icon: 'chat',
      size: 'medium'
    },
    {
      title: t('titles.worldBuilder'),
      icon: 'planet',
      size: 'medium'
    }
  ];

  const leftToolbarIcons: ToolbarIconInterface[] = [
    {
      title: t('labels.notifications'),
      icon: 'bell',
      size: 'medium'
    }
  ];

  return (
    <>
      {screenShareStore.widget.isOpen && <ScreenSharePage />}
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
        <styled.LeftToolbars>
          <ToolbarIconList>
            {user?.profile && (
              <ToolbarIcon title={t('titles.profile')} onClick={profileMenuStore.openProfileMenu}>
                <Avatar
                  size="extra-small"
                  status={user.status}
                  avatarSrc={user.avatarSrc}
                  showBorder
                  showHover
                />
              </ToolbarIcon>
            )}
            {leftToolbarIcons.map((item) => (
              <ToolbarIcon key={item.title} {...item} state={{canGoBack: true}} />
            ))}
          </ToolbarIconList>
        </styled.LeftToolbars>
        <styled.RightToolbars>
          <styled.OnlineUsers>
            <OnlineUsersWidget currentUser={sessionStore.user} />
          </styled.OnlineUsers>
          <ToolbarIconList>
            {rightToolbarIcons.map((item) => (
              <ToolbarIcon key={item.title} {...item} state={{canGoBack: true}} />
            ))}
          </ToolbarIconList>
        </styled.RightToolbars>
      </styled.Footer>
    </>
  );
};

export default observer(Widgets);
