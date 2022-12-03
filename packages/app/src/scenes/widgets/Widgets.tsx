import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {Avatar, ToolbarIcon, ToolbarIconInterface, ToolbarIconList} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';

import {
  OnlineUsersWidget,
  FlyToMeWidget,
  MinimapWidget,
  ScreenShareWidget,
  SocialWidget,
  CalendarWidget,
  ProfileWidget
} from './pages';
import * as styled from './Widgets.styled';

const Widgets: FC = () => {
  const {
    sessionStore,
    widgetsStore,
    flightStore,
    mainStore,
    worldBuilderStore,
    agoraStore,
    objectStore
  } = useStore();
  const {profileStore, minimapStore, flyToMeStore, screenShareStore, socialStore, calendarStore} =
    widgetsStore;
  const {agoraScreenShareStore} = agoraStore;
  const {unityStore, worldStore} = mainStore;
  const {user} = sessionStore;
  const {asset: asset2D} = objectStore;

  const {t} = useTranslation();

  useEffect(() => {
    worldBuilderStore.fetchPermissions();
  }, [unityStore, worldBuilderStore]);

  const handleOpenScreenShare = () => {
    agoraScreenShareStore.init(worldStore.worldId, sessionStore.userId);
    screenShareStore.widget.open();
  };

  const rightToolbarIcons: ToolbarIconInterface[] = [
    {
      title: t('labels.screenShare'),
      icon: 'screenshare',
      size: 'medium',
      onClick: handleOpenScreenShare
    },
    {
      title: t('labels.calendar'),
      icon: 'calendar',
      size: 'medium',
      onClick: calendarStore.widget.open,
      disabled: flightStore.isFlightWithMe
    },
    {
      title: t('labels.worldChat'),
      icon: 'chat',
      size: 'medium',
      onClick: socialStore.widget.toggle,
      isSelected: asset2D?.isExpanded !== true && socialStore.widget.isOpen
    },
    {
      title: 'Fly to me',
      icon: 'fly-to',
      size: 'medium',
      onClick: widgetsStore.flyToMeStore.flyToMeDialog.open,
      disabled: false // TODO: Check permissions
    },
    {
      title: t('titles.worldBuilder'),
      icon: 'planet',
      size: 'medium',
      link: ROUTES.worldBuilder.builder
    }
  ];

  const leftToolbarIcons: ToolbarIconInterface[] = [
    {
      title: t('labels.notifications'),
      icon: 'bell',
      size: 'medium'
    },
    {
      title: t('labels.minimap'),
      icon: 'solar-system',
      size: 'medium',
      isSelected: minimapStore.minimapDialog.isOpen,
      onClick: minimapStore.minimapDialog.toggle
    }
  ];

  return (
    <>
      <styled.Footer data-testid="Widgets-test">
        <styled.LeftToolbars>
          <ToolbarIconList>
            {user?.profile && (
              <ToolbarIcon title={t('titles.profile')} onClick={profileStore.profileDialog.open}>
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

      {profileStore.profileDialog.isOpen && <ProfileWidget />}
      {minimapStore.minimapDialog.isOpen && <MinimapWidget />}
      {flyToMeStore.flyToMeDialog.isOpen && <FlyToMeWidget />}
      {screenShareStore.widget.isOpen && <ScreenShareWidget />}
      {calendarStore.widget.isOpen && <CalendarWidget />}
      {asset2D?.isExpanded !== true && socialStore.widget.isOpen && <SocialWidget />}
    </>
  );
};

export default observer(Widgets);
