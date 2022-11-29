import React, {FC, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {Avatar, ToolbarIcon, ToolbarIconInterface, ToolbarIconList} from '@momentum-xyz/ui-kit';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';

import {OnlineUsersWidget, FlyToMeWidget} from './pages';
import * as styled from './Widgets.styled';

const Widgets: FC = () => {
  const {sessionStore, widgetStore, widgetsStore, flightStore, mainStore, worldBuilderStore} =
    useStore();
  const {unityStore} = mainStore;
  const {profileMenuStore} = widgetStore;
  const {user} = sessionStore;

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
      size: 'medium'
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
      title: 'Fly to me',
      icon: 'fly-to',
      size: 'medium',
      onClick: widgetsStore.flyToMeStore.flyToMeDialog.open,
      disabled: false // TODO: Check permissions
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
      {widgetsStore.flyToMeStore.flyToMeDialog.isOpen && <FlyToMeWidget />}

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
