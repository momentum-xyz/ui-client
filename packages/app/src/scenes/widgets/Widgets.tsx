import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {Avatar, ToolbarIcon, ToolbarIconList} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';

import {
  ProfileWidget,
  FlyToMeWidget,
  MinimapWidget,
  ScreenShareWidget,
  SocialWidget,
  CalendarWidget,
  OnlineUsersWidget
} from './pages';
import * as styled from './Widgets.styled';

interface PropsInterface {
  isExplorePage?: boolean;
}

const Widgets: FC<PropsInterface> = (props) => {
  const {isExplorePage} = props;

  const {
    sessionStore,
    widgetsStore,
    flightStore,
    mainStore,
    worldBuilderStore,
    agoraStore,
    objectStore
  } = useStore();
  const {agoraScreenShareStore} = agoraStore;
  const {unityStore, worldStore} = mainStore;
  const {asset: asset2D} = objectStore;
  const {user} = sessionStore;

  const {t} = useTranslation();

  useEffect(() => {
    worldBuilderStore.fetchPermissions();
  }, [unityStore, worldBuilderStore]);

  const handleOpenScreenShare = () => {
    agoraScreenShareStore.init(worldStore.worldId, sessionStore.userId);
    widgetsStore.screenShareStore.widget.open();
  };

  return (
    <>
      <styled.Footer data-testid="Widgets-test">
        <styled.LeftToolbars>
          <ToolbarIconList>
            <ToolbarIcon
              title={t('titles.profile')}
              onClick={widgetsStore.profileStore.profileDialog.open}
            >
              <Avatar
                size="extra-small"
                status={user?.status}
                avatarSrc={user?.avatarSrc}
                showBorder
                showHover
              />
            </ToolbarIcon>

            <ToolbarIcon
              title={t('labels.notifications')}
              icon="bell"
              size="medium"
              state={{canGoBack: true}}
            />

            <ToolbarIcon
              title="Explore"
              icon="solar-system"
              size="medium"
              onClick={() => {
                // FIXME: Hard redirect because of unity
                document.location = ROUTES.explore;
              }}
              state={{canGoBack: true}}
            />
          </ToolbarIconList>
        </styled.LeftToolbars>

        {!isExplorePage && (
          <styled.RightToolbars>
            <styled.OnlineUsers>
              <OnlineUsersWidget currentUser={sessionStore.user} />
            </styled.OnlineUsers>
            <ToolbarIconList>
              <ToolbarIcon
                title={t('labels.screenShare')}
                icon="screenshare"
                size="medium"
                onClick={handleOpenScreenShare}
                state={{canGoBack: true}}
              />

              <ToolbarIcon
                title={t('labels.calendar')}
                icon="calendar"
                size="medium"
                onClick={widgetsStore.calendarStore.widget.open}
                disabled={flightStore.isFlightWithMe}
                state={{canGoBack: true}}
              />

              <ToolbarIcon
                title={t('labels.minimap')}
                icon="vector"
                size="medium"
                isSelected={widgetsStore.minimapStore.minimapDialog.isOpen}
                onClick={widgetsStore.minimapStore.minimapDialog.toggle}
                state={{canGoBack: true}}
              />

              <ToolbarIcon
                title={t('labels.worldChat')}
                icon="chat"
                size="medium"
                onClick={widgetsStore.socialStore.widget.toggle}
                isSelected={asset2D?.isExpanded !== true && widgetsStore.socialStore.widget.isOpen}
                state={{canGoBack: true}}
              />

              <ToolbarIcon
                title="Fly to me"
                icon="fly-to"
                size="medium"
                onClick={widgetsStore.flyToMeStore.flyToMeDialog.open}
                disabled={false} // TODO: Check permissions
                state={{canGoBack: true}}
              />

              <ToolbarIcon
                title={t('titles.worldBuilder')}
                icon="planet"
                size="medium"
                link={ROUTES.worldBuilder.builder}
                state={{canGoBack: true}}
              />
            </ToolbarIconList>
          </styled.RightToolbars>
        )}
      </styled.Footer>

      {widgetsStore.profileStore.profileDialog.isOpen && <ProfileWidget />}
      {widgetsStore.minimapStore.minimapDialog.isOpen && <MinimapWidget />}
      {widgetsStore.flyToMeStore.flyToMeDialog.isOpen && <FlyToMeWidget />}
      {widgetsStore.screenShareStore.widget.isOpen && <ScreenShareWidget />}
      {widgetsStore.calendarStore.widget.isOpen && <CalendarWidget />}
      {asset2D?.isExpanded !== true && widgetsStore.socialStore.widget.isOpen && <SocialWidget />}
    </>
  );
};

export default observer(Widgets);
