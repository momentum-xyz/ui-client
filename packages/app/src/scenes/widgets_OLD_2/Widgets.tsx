import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useNavigate} from 'react-router-dom';
import {
  Avatar,
  Button,
  Tooltip,
  Text,
  ToolbarIcon,
  ToolbarIconList,
  ToolbarIconSeparator
} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';
// import {ToolbarCreatorIcon} from 'ui-kit';

import {
  SignInWidget,
  FlyToMeWidget,
  MinimapWidget,
  ScreenShareWidget,
  TextChatWidget,
  CalendarWidget,
  NotificationsWidget,
  MagicLinkWidget
} from './pages';
import * as styled from './Widgets.styled';

interface PropsInterface {
  isExplorePage?: boolean;
}

const Widgets: FC<PropsInterface> = (props) => {
  const {isExplorePage} = props;

  const {sessionStore, widgetsStore, universeStore, agoraStore} = useStore();
  // const {onlineUsersStore} = widgetsStore;
  const {
    world2dStore
    // world3dStore
  } = universeStore;
  const {agoraScreenShareStore} = agoraStore;
  const {user} = sessionStore;

  const {t} = useI18n();
  const navigate = useNavigate();
  // const {pathname} = useLocation();

  // useEffect(() => {
  //   onlineUsersStore.init(universeStore.worldId, sessionStore.userId);
  //   onlineUsersStore.fetchUser(sessionStore.userId);
  // }, [onlineUsersStore, sessionStore.userId, universeStore.worldId]);

  useEffect(() => {
    agoraScreenShareStore.init(
      universeStore.worldId,
      sessionStore.userId,
      widgetsStore.screenShareStore.dialog.open
    );
  }, [agoraScreenShareStore, widgetsStore, sessionStore.userId, universeStore.worldId]);

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
                  navigate(ROUTES.explore, {replace: true});
                }}
              />
            )}

            <ToolbarIcon
              title={t('titles.profile')}
              //onClick={widgetsStore.profileStore.dialog.toggle}
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
              title={t('labels.staking')}
              icon="wallet"
              size="medium"
              disabled={sessionStore.isGuest}
              // onClick={nftStore.stakingDashorboardDialog.toggle}
              // isSelected={nftStore.stakingDashorboardDialog.isOpen}
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
              {/* <OnlineUsersWidget
                currentUser={sessionStore.user}
                worldId={universeStore.worldId}
                onClick={onlineUsersStore.dialog.toggle}
              /> */}
            </styled.OnlineUsers>
            <ToolbarIconList>
              <Tooltip label={t('labels.bio')} placement="top">
                <styled.CurrentOdyssey
                  onClick={() => {
                    // odysseyBioStore.open(universeStore.worldId)
                  }}
                >
                  <Text
                    className="odyssey-name"
                    size="m"
                    text={null}
                    transform="uppercase"
                    weight="bold"
                  />
                  <ToolbarIcon title="" state={{canGoBack: true}} icon="people" size="medium" />
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
                disabled={!world2dStore?.isMyWorld || false}
                state={{canGoBack: true}}
              />

              {/* <ToolbarCreatorIcon
                worldId={universeStore.worldId}
                isAdmin={universeStore.isCurrentUserWorldAdmin}
                onCloseAndReset={world3dStore?.closeAndResetObjectMenu}
                isBuilderMode={pathname.includes(
                  generatePath(ROUTES.odyssey.creator.base, {worldId: universeStore.worldId})
                )}
              /> */}
            </ToolbarIconList>
          </styled.RightToolbars>
        )}
      </styled.Footer>

      {!isExplorePage && sessionStore.isGuest && widgetsStore.signInDialogAvailable && (
        <SignInWidget />
      )}

      {/* {onlineUsersStore.dialog.isOpen && <SearchUsersWidget />} */}
      {widgetsStore.notificationsStore.dialog.isOpen && <NotificationsWidget />}
      {widgetsStore.minimapStore.dialog.isOpen && <MinimapWidget />}
      {widgetsStore.flyToMeStore.dialog.isOpen && <FlyToMeWidget />}
      {widgetsStore.magicLinkStore.dialog.isOpen && <MagicLinkWidget />}
      {widgetsStore.screenShareStore.dialog.isOpen && <ScreenShareWidget />}
      {widgetsStore.calendarStore.dialog.isOpen && <CalendarWidget />}
      {widgetsStore.textChatStore.dialog.isOpen && <TextChatWidget />}
    </>
  );
};

export default observer(Widgets);
