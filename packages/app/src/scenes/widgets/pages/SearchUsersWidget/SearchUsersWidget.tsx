import {observer} from 'mobx-react-lite';
import React, {FC, useEffect} from 'react';
import {generatePath, useHistory} from 'react-router-dom';
import {Avatar, PanelLayout, Portal, SearchInput, SvgButton, Text} from '@momentum-xyz/ui-kit';
import cn from 'classnames';
import {useTranslation} from 'react-i18next';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';

import * as styled from './SearchUsersWidget.styled';
import {UserProfilePanel} from './components';

const DIALOG_WIDTH_PX = 296;

const SearchUsersWidget: FC = () => {
  const {mainStore, widgetsStore, nftStore, authStore, sessionStore} = useStore();
  const {unityStore, worldStore} = mainStore;
  const {onlineUsersStore} = widgetsStore;

  const {t} = useTranslation();
  const history = useHistory();

  useEffect(() => {
    unityStore.changeKeyboardControl(false);
    return () => {
      unityStore.changeKeyboardControl(true);
    };
  }, [unityStore]);

  const handleClose = () => {
    onlineUsersStore.searchWidget.close();
    onlineUsersStore?.unselectUser();
  };

  const handleTeleport = (worldId: string) => {
    console.log(`Calling loadWorldById to ${worldId} ...`);
    handleClose();
    history.replace(generatePath(ROUTES.odyssey.base, {worldId}));
    unityStore.loadWorldById(worldId, authStore.token);
  };

  const handleHighFive = (userId: string) => {
    console.log(`Calling sendHighFive to ${userId} ...`);
    unityStore.sendHighFive(userId);
  };

  const handleUserClick = (id: string) => {
    if (id === sessionStore.userId) {
      return;
    }
    if (onlineUsersStore?.selectedUserId !== id) {
      onlineUsersStore?.selectUser(nftStore.nftItems, id);
    } else {
      onlineUsersStore?.unselectUser();
    }
  };

  return (
    <Portal>
      <styled.Modal data-testid="SearchUsersWidget-test">
        <styled.OuterContainer>
          <PanelLayout
            title="Online"
            onClose={handleClose}
            headerStyle="uppercase"
            headerIconName="people"
            iconSize="large"
            showCloseButton
            showOverflow
            componentSize={{width: `${DIALOG_WIDTH_PX}px;`}}
          >
            <styled.Container data-testid="SearchUsersWidget-test">
              <SearchInput
                placeholder={t('placeholders.searchForPeople')}
                onChange={(query: string) => onlineUsersStore.searchUsers(query)}
              />
              <styled.List className="noScrollIndicator">
                {onlineUsersStore.searchedUsers && onlineUsersStore.searchedUsers.length > 0
                  ? onlineUsersStore.searchedUsers.map((user) => (
                      <styled.Item key={user.id}>
                        <styled.Information
                          className={cn(user.id === sessionStore.userId && 'noPointer')}
                          onClick={() => handleUserClick(user.id)}
                        >
                          <Avatar avatarSrc={user.avatarSrc} size="small" />
                          <Text size="s" text={user.name} transform="capitalized" />
                        </styled.Information>
                        {!user.isGuest && (
                          <styled.RightToolbar>
                            {user.id === worldStore.worldId && (
                              <styled.AdminText size="s" text={t('titles.admin')} />
                            )}
                            <SvgButton
                              iconName="fly-to"
                              size="normal"
                              disabled={user?.id === worldStore.worldId}
                              onClick={() => handleTeleport(user?.id || '')}
                            />
                            <SvgButton
                              iconName="high-five"
                              size="normal"
                              disabled={user?.id === sessionStore.userId}
                              onClick={() => handleHighFive(user?.id || '')}
                            />
                          </styled.RightToolbar>
                        )}
                      </styled.Item>
                    ))
                  : !onlineUsersStore.query &&
                    onlineUsersStore.allUsers.map((user) => (
                      <styled.Item key={user.id}>
                        <styled.Information
                          className={cn(user.id === sessionStore.userId && 'noPointer')}
                          onClick={() => handleUserClick(user.id)}
                        >
                          <Avatar avatarSrc={user.avatarSrc} size="small" />
                          <Text size="s" text={user.name} transform="capitalized" />
                        </styled.Information>
                        {!user.isGuest && (
                          <styled.RightToolbar>
                            {user.id === worldStore.worldId && (
                              <styled.AdminText size="s" text={t('titles.admin')} />
                            )}
                            <SvgButton
                              iconName="fly-to"
                              size="normal"
                              disabled={user?.id === worldStore.worldId}
                              onClick={() => handleTeleport(user?.id || '')}
                            />
                            <SvgButton
                              iconName="high-five"
                              size="normal"
                              disabled={user?.id === sessionStore.userId}
                              onClick={() => {
                                handleHighFive(user?.id || '');
                              }}
                            />
                          </styled.RightToolbar>
                        )}
                      </styled.Item>
                    ))}
              </styled.List>
            </styled.Container>
          </PanelLayout>
          <styled.UsersContainer>
            {onlineUsersStore.selectedUserId && (
              <UserProfilePanel
                odyssey={onlineUsersStore.odyssey}
                user={onlineUsersStore.user}
                userAvatar={onlineUsersStore.avatarSrc}
                onTeleport={handleTeleport}
                onHighFive={handleHighFive}
                onClose={onlineUsersStore.unselectUser}
                alreadyConnected={nftStore.isAlreadyConnected(
                  onlineUsersStore.odyssey?.owner || ''
                )}
                onConnect={() => {
                  if (onlineUsersStore.odyssey) {
                    nftStore.setConnectToNftItemId(onlineUsersStore.odyssey.id);
                  }
                }}
                nftId={onlineUsersStore.nftId}
                worldId={onlineUsersStore.worldId}
              />
            )}
          </styled.UsersContainer>
        </styled.OuterContainer>
      </styled.Modal>
    </Portal>
  );
};

export default observer(SearchUsersWidget);
