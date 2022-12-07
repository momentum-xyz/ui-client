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
  OnlineUsersWidget,
  NotificationsWidget,
  OdysseyWidget,
  WorldBuilderWidget
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
    objectStore,
    nftStore
  } = useStore();
  const {onlineUsersStore, odysseyStore, calendarStore} = widgetsStore;
  const {agoraScreenShareStore} = agoraStore;
  const {worldStore} = mainStore;
  const {asset: asset2D} = objectStore;
  const {user} = sessionStore;

  const {t} = useTranslation();

  useEffect(() => {
    worldBuilderStore.fetchPermissions();
    odysseyStore.init(nftStore.nftItems, worldStore.worldId);
    onlineUsersStore.init(worldStore.worldId, sessionStore.userId);
  }, [
    nftStore.nftItems,
    odysseyStore,
    onlineUsersStore,
    sessionStore.userId,
    worldBuilderStore,
    worldStore.worldId
  ]);

  const handleOpenScreenShare = () => {
    agoraScreenShareStore.init(worldStore.worldId, sessionStore.userId);
    widgetsStore.screenShareStore.widget.open();
  };

  const handleOpenOdysseyWidget = () => {
    calendarStore.eventList.fetchSpaceEvents(worldStore.worldId);
    odysseyStore.widget.open();
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

            {!isExplorePage && (
              <ToolbarIcon
                title="Newsfeed"
                icon="bell"
                size="medium"
                onClick={widgetsStore.notificationsStore.notificationsDialog.toggle}
                isSelected={widgetsStore.notificationsStore.notificationsDialog.isOpen}
                state={{canGoBack: true}}
              />
            )}

            <ToolbarIcon
              title="Connections"
              icon="user-network"
              size="medium"
              disabled={false} // TODO: Disable for guests
              state={{canGoBack: true}}
            />

            <ToolbarIcon
              title="Staking"
              icon="wallet"
              size="medium"
              disabled={false} // TODO: Disable for guests
              state={{canGoBack: true}}
            />

            {!isExplorePage && (
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
            )}
          </ToolbarIconList>
        </styled.LeftToolbars>

        {!isExplorePage && (
          <styled.RightToolbars>
            <styled.OnlineUsers>
              <OnlineUsersWidget currentUser={sessionStore.user} worldId={worldStore.worldId} />
            </styled.OnlineUsers>
            <ToolbarIconList>
              <ToolbarIcon
                title="Bio"
                icon="people"
                size="medium"
                disabled={false}
                onClick={handleOpenOdysseyWidget}
                state={{canGoBack: true}}
              />

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

              <WorldBuilderWidget />
            </ToolbarIconList>
          </styled.RightToolbars>
        )}
      </styled.Footer>

      {widgetsStore.odysseyStore.widget.isOpen && (
        <OdysseyWidget
          odyssey={odysseyStore.odyssey}
          events={calendarStore.eventList.events.length}
          onClose={odysseyStore.widget.close}
          nftId={odysseyStore.nftId}
        />
      )}
      {widgetsStore.profileStore.profileDialog.isOpen && (
        <ProfileWidget isVisitAvailable={!!isExplorePage} />
      )}
      {widgetsStore.notificationsStore.notificationsDialog.isOpen && <NotificationsWidget />}
      {widgetsStore.minimapStore.minimapDialog.isOpen && <MinimapWidget />}
      {widgetsStore.flyToMeStore.flyToMeDialog.isOpen && <FlyToMeWidget />}
      {widgetsStore.screenShareStore.widget.isOpen && <ScreenShareWidget />}
      {widgetsStore.calendarStore.widget.isOpen && <CalendarWidget />}
      {asset2D?.isExpanded !== true && widgetsStore.socialStore.widget.isOpen && <SocialWidget />}
    </>
  );
};

export default observer(Widgets);
