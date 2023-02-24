import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {generatePath, useLocation} from 'react-router-dom';
import {
  Avatar,
  Button,
  Tooltip,
  Text,
  ToolbarIcon,
  ToolbarIconList,
  ToolbarIconSeparator
} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';
import {ToolbarCreatorIcon} from 'ui-kit';

import {
  SignInWidget,
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

  const {sessionStore, widgetsStore, unityStore, agoraStore, nftStore} = useStore();
  const {onlineUsersStore, odysseyBioStore, mutualConnectionsStore} = widgetsStore;
  const {unityWorldStore, unityInstanceStore} = unityStore;
  const {agoraScreenShareStore} = agoraStore;
  const {user} = sessionStore;

  const worldOwner = nftStore.getNftByUuid(unityStore.worldId);

  const {t} = useTranslation();
  const {pathname} = useLocation();

  useEffect(() => {
    onlineUsersStore.init(unityStore.worldId, sessionStore.userId);
    onlineUsersStore.fetchUser(unityStore.worldId);
  }, [odysseyBioStore, onlineUsersStore, sessionStore.userId, unityStore.worldId]);

  useEffect(() => {
    agoraScreenShareStore.init(
      unityStore.worldId,
      sessionStore.userId,
      widgetsStore.screenShareStore.dialog.open
    );
  }, [agoraScreenShareStore, widgetsStore, sessionStore.userId, unityStore.worldId]);

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
              onClick={widgetsStore.profileStore.dialog.toggle}
            >
              <Avatar size="extra-small" avatarSrc={user?.avatarSrc} showBorder showHover />
            </ToolbarIcon>

            {!isExplorePage && (
              <ToolbarIcon
                title={t('labels.newsfeed')}
                icon="clock-two"
                size="medium-large"
                onClick={widgetsStore.notificationsStore.dialog.toggle}
                isSelected={widgetsStore.notificationsStore.dialog.isOpen}
                state={{canGoBack: true}}
              />
            )}

            <ToolbarIcon
              title={t('labels.connections')}
              icon="user-network"
              size="medium"
              disabled={sessionStore.isGuest}
              onClick={mutualConnectionsStore.dialog.open}
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
                worldId={unityStore.worldId}
                onClick={onlineUsersStore.dialog.toggle}
              />
            </styled.OnlineUsers>
            <ToolbarIconList>
              <Tooltip label={t('labels.bio')} placement="top">
                <styled.CurrentOdyssey onClick={() => odysseyBioStore.open(worldOwner)}>
                  <Text
                    className="odyssey-name"
                    size="m"
                    text={unityWorldStore?.nftOfWorld?.name || null}
                    transform="uppercase"
                    weight="bold"
                  />
                  <ToolbarIcon
                    title=""
                    state={{canGoBack: true}}
                    icon={unityWorldStore.worldImageSrc ? undefined : 'people'}
                    size="medium"
                  >
                    {unityWorldStore.worldImageSrc && (
                      <Avatar
                        size="extra-small"
                        avatarSrc={unityWorldStore.worldImageSrc}
                        showBorder
                        showHover
                      />
                    )}
                  </ToolbarIcon>
                </styled.CurrentOdyssey>
              </Tooltip>

              <ToolbarIcon
                title={t('labels.calendar')}
                icon="calendar"
                size="medium"
                onClick={widgetsStore.calendarStore.dialog.toggle}
                isSelected={widgetsStore.calendarStore.dialog.isOpen}
                state={{canGoBack: true}}
              />

              <ToolbarIcon
                title={t('labels.minimap')}
                icon="vector"
                size="medium"
                isSelected={widgetsStore.minimapStore.dialog.isOpen}
                onClick={widgetsStore.minimapStore.toggle}
                state={{canGoBack: true}}
              />

              <ToolbarIcon
                title={t('labels.voiceChat')}
                icon="microphoneOn"
                size="medium"
                onClick={widgetsStore.voiceChatStore.dialog.toggle}
                isSelected={widgetsStore.voiceChatStore.dialog.isOpen}
                state={{canGoBack: true}}
              />

              <ToolbarIcon
                title={t('labels.chat')}
                icon="groupChat"
                size="medium"
                onClick={widgetsStore.textChatStore.dialog.toggle}
                isSelected={widgetsStore.textChatStore.dialog.isOpen}
                state={{canGoBack: true}}
              />

              <ToolbarIcon
                title={t('labels.shareLink')}
                icon="link"
                size="medium"
                onClick={widgetsStore.magicLinkStore.dialog.open}
                isSelected={widgetsStore.magicLinkStore.dialog.isOpen}
                state={{canGoBack: true}}
              />

              <ToolbarIconSeparator />

              <ToolbarIcon
                title={t('labels.screenShare')}
                icon="screenshare"
                size="medium"
                onClick={widgetsStore.screenShareStore.dialog.toggle}
                isSelected={widgetsStore.screenShareStore.dialog.isOpen}
                state={{canGoBack: true}}
              />

              <ToolbarIcon
                title={t('labels.flyToMe')}
                icon="fly-to"
                size="medium"
                onClick={widgetsStore.flyToMeStore.dialog.open}
                disabled={!unityWorldStore.isMyWorld}
                state={{canGoBack: true}}
              />

              <ToolbarCreatorIcon
                worldId={unityStore.worldId}
                isAdmin={unityStore.isCurrentUserWorldAdmin}
                onCloseAndReset={unityInstanceStore.closeAndResetObjectMenu}
                isBuilderMode={pathname.includes(
                  generatePath(ROUTES.odyssey.creator.base, {worldId: unityStore.worldId})
                )}
              />
            </ToolbarIconList>
          </styled.RightToolbars>
        )}
      </styled.Footer>

      {!isExplorePage && sessionStore.isGuest && widgetsStore.signInDialogAvailable && (
        <SignInWidget />
      )}

      {mutualConnectionsStore.dialog.isOpen && <MutualConnectionsWidget />}
      {onlineUsersStore.dialog.isOpen && <SearchUsersWidget />}
      {widgetsStore.odysseyBioStore.dialog.isOpen && <OdysseyBioWidget />}
      {widgetsStore.odysseyInfoStore.dialog.isOpen && <OdysseyInfoWidget />}
      {widgetsStore.profileStore.dialog.isOpen && <ProfileWidget />}
      {widgetsStore.notificationsStore.dialog.isOpen && <NotificationsWidget />}
      {widgetsStore.minimapStore.dialog.isOpen && <MinimapWidget />}
      {widgetsStore.flyToMeStore.dialog.isOpen && <FlyToMeWidget />}
      {widgetsStore.magicLinkStore.dialog.isOpen && <MagicLinkWidget />}
      {widgetsStore.screenShareStore.dialog.isOpen && <ScreenShareWidget />}
      {widgetsStore.calendarStore.dialog.isOpen && <CalendarWidget />}
      {widgetsStore.textChatStore.dialog.isOpen && <TextChatWidget />}
      {widgetsStore.voiceChatStore.dialog.isOpen && <VoiceChatWidget />}
      {nftStore.stakingDashorboardDialog.isOpen && <StakingWidget />}
      {!!nftStore.connectToNftItemId && <ConnectWidget />}
    </>
  );
};

export default observer(Widgets);
