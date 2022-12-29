import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {
  Avatar,
  Button,
  ToolbarIcon,
  ToolbarIconList,
  ToolbarIconSeparator
} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';

import {
  ProfileWidget,
  FlyToMeWidget,
  MinimapWidget,
  ScreenShareWidget,
  TextChatWidget,
  VoiceChatWidget,
  CalendarWidget,
  OnlineUsersWidget,
  NotificationsWidget,
  OdysseyBioWidget,
  OdysseyInfoWidget,
  WorldBuilderWidget,
  SearchUsersWidget,
  MutualConnectionsWidget,
  StakingWidget,
  ConnectWidget,
  MagicLinkWidget
} from './pages';
import * as styled from './Widgets.styled';

interface PropsInterface {
  isExplorePage?: boolean;
}

const Widgets: FC<PropsInterface> = (props) => {
  const {isExplorePage} = props;

  const {sessionStore, widgetsStore, flightStore, mainStore, agoraStore, nftStore} = useStore();
  const {onlineUsersStore, odysseyBioStore, mutualConnectionsStore} = widgetsStore;
  const {agoraScreenShareStore} = agoraStore;
  const {worldStore} = mainStore;
  const {user} = sessionStore;

  const {t} = useTranslation();

  useEffect(() => {
    onlineUsersStore.init(worldStore.worldId, sessionStore.userId);
  }, [onlineUsersStore, sessionStore.userId, worldStore.worldId]);

  useEffect(() => {
    agoraScreenShareStore.init(
      worldStore.worldId,
      sessionStore.userId,
      widgetsStore.screenShareStore.widget.open
    );
  }, [agoraScreenShareStore, widgetsStore, sessionStore.userId, worldStore.worldId]);

  return (
    <>
      <styled.Footer data-testid="Widgets-test">
        <styled.LeftToolbars>
          <ToolbarIconList>
            {!isExplorePage && (
              <ToolbarIcon
                title={t('labels.explore')}
                icon="leave-left"
                size="medium"
                onClick={() => {
                  // FIXME: Hard redirect because of unity
                  document.location = ROUTES.explore;
                }}
                state={{canGoBack: true}}
              />
            )}

            <ToolbarIcon
              title={t('titles.profile')}
              onClick={widgetsStore.profileStore.profileDialog.toggle}
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
                title={t('labels.newsfeed')}
                icon="clock-two"
                size="medium-large"
                onClick={widgetsStore.notificationsStore.notificationsDialog.toggle}
                isSelected={widgetsStore.notificationsStore.notificationsDialog.isOpen}
                state={{canGoBack: true}}
              />
            )}

            <ToolbarIcon
              title={t('labels.connections')}
              icon="user-network"
              size="medium"
              disabled={sessionStore.isGuest}
              onClick={mutualConnectionsStore.widget.open}
              state={{canGoBack: true}}
            />

            <ToolbarIcon
              title={t('labels.staking')}
              icon="wallet"
              size="medium"
              disabled={sessionStore.isGuest}
              onClick={nftStore.stakingDashorboardDialog.toggle}
              isSelected={nftStore.stakingDashorboardDialog.isOpen}
              state={{canGoBack: true}}
            />
          </ToolbarIconList>
        </styled.LeftToolbars>

        {isExplorePage && (
          <styled.Links>
            <Button
              label={t('labels.discoverMore')}
              variant="secondary"
              onClick={() => {
                window.open('https://discover.odyssey.org');
              }}
            />
          </styled.Links>
        )}

        {!isExplorePage && (
          <styled.RightToolbars>
            <styled.OnlineUsers>
              <OnlineUsersWidget
                currentUser={sessionStore.user}
                worldId={worldStore.worldId}
                onClick={onlineUsersStore.searchWidget.toggle}
              />
            </styled.OnlineUsers>
            <ToolbarIconList>
              <ToolbarIcon
                title={t('labels.bio')}
                icon="people"
                size="medium"
                isSelected={odysseyBioStore.widget.isOpen}
                onClick={() => odysseyBioStore.open(nftStore.getNftByUuid(worldStore.worldId))}
                state={{canGoBack: true}}
              />

              <ToolbarIcon
                title={t('labels.calendar')}
                icon="calendar"
                size="medium"
                onClick={widgetsStore.calendarStore.widget.toggle}
                isSelected={widgetsStore.calendarStore.widget.isOpen}
                disabled={flightStore.isFlightWithMe}
                state={{canGoBack: true}}
              />

              <ToolbarIcon
                title={t('labels.minimap')}
                icon="vector"
                size="medium"
                isSelected={widgetsStore.minimapStore.minimapDialog.isOpen}
                onClick={widgetsStore.minimapStore.toggle}
                state={{canGoBack: true}}
              />

              <ToolbarIcon
                title={t('labels.voiceChat')}
                icon="microphoneOn"
                size="medium"
                onClick={widgetsStore.voiceChatStore.widget.toggle}
                isSelected={widgetsStore.voiceChatStore.widget.isOpen}
                state={{canGoBack: true}}
              />

              <ToolbarIcon
                title={t('labels.chat')}
                icon="groupChat"
                size="medium"
                onClick={widgetsStore.textChatStore.widget.toggle}
                isSelected={widgetsStore.textChatStore.widget.isOpen}
                state={{canGoBack: true}}
              />

              <ToolbarIcon
                title={t('labels.shareLink')}
                icon="link"
                size="medium"
                onClick={widgetsStore.magicLinkStore.magicLinkDialog.open}
                isSelected={widgetsStore.magicLinkStore.magicLinkDialog.isOpen}
                state={{canGoBack: true}}
              />

              <ToolbarIconSeparator />

              <ToolbarIcon
                title={t('labels.screenShare')}
                icon="screenshare"
                size="medium"
                onClick={widgetsStore.screenShareStore.widget.toggle}
                isSelected={widgetsStore.screenShareStore.widget.isOpen}
                state={{canGoBack: true}}
              />

              <ToolbarIcon
                title={t('labels.flyToMe')}
                icon="fly-to"
                size="medium"
                onClick={widgetsStore.flyToMeStore.flyToMeDialog.open}
                disabled={!worldStore.isMyWorld}
                state={{canGoBack: true}}
              />

              <WorldBuilderWidget />
            </ToolbarIconList>
          </styled.RightToolbars>
        )}
      </styled.Footer>

      {mutualConnectionsStore.widget.isOpen && <MutualConnectionsWidget />}
      {onlineUsersStore.searchWidget.isOpen && <SearchUsersWidget />}
      {widgetsStore.odysseyBioStore.widget.isOpen && <OdysseyBioWidget />}
      {widgetsStore.odysseyInfoStore.widget.isOpen && <OdysseyInfoWidget />}
      {widgetsStore.profileStore.profileDialog.isOpen && <ProfileWidget />}
      {widgetsStore.notificationsStore.notificationsDialog.isOpen && <NotificationsWidget />}
      {widgetsStore.minimapStore.minimapDialog.isOpen && <MinimapWidget />}
      {widgetsStore.flyToMeStore.flyToMeDialog.isOpen && <FlyToMeWidget />}
      {widgetsStore.magicLinkStore.magicLinkDialog.isOpen && <MagicLinkWidget />}
      {widgetsStore.screenShareStore.widget.isOpen && <ScreenShareWidget />}
      {widgetsStore.calendarStore.widget.isOpen && <CalendarWidget />}
      {widgetsStore.textChatStore.widget.isOpen && <TextChatWidget />}
      {widgetsStore.voiceChatStore.widget.isOpen && <VoiceChatWidget />}
      {nftStore.stakingDashorboardDialog.isOpen && <StakingWidget />}
      {!!nftStore.connectToNftItemId && <ConnectWidget />}
    </>
  );
};

export default observer(Widgets);
