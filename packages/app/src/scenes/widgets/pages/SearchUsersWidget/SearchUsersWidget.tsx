import {observer} from 'mobx-react-lite';
import React, {FC, useEffect} from 'react';
import {generatePath, useHistory} from 'react-router-dom';
import {Avatar, PanelLayout, Portal, SearchInput, SvgButton, Text} from '@momentum-xyz/ui-kit';

import {ROUTES} from 'core/constants';
import {UserModelInterface} from 'core/models';
import {useStore} from 'shared/hooks';

import * as styled from './SearchUsersWidget.styled';
import {UserProfilePanel} from './components';

interface PropsInterface {
  users: Array<UserModelInterface>;
  searchedUsers?: Array<UserModelInterface>;
  searchUsers: (userId: string) => void;
  onClose?: () => void;
}

const DIALOG_WIDTH_PX = 296;

const SearchUsersWidget: FC<PropsInterface> = (props) => {
  const {users, onClose, searchUsers, searchedUsers} = props;
  const {mainStore, widgetsStore, nftStore, authStore, sessionStore} = useStore();
  const {unityStore, worldStore} = mainStore;
  const {onlineUsersStore} = widgetsStore;

  const history = useHistory();

  useEffect(() => {
    unityStore.changeKeyboardControl(false);
    return () => {
      unityStore.changeKeyboardControl(true);
    };
  }, [unityStore]);

  const handleClose = () => {
    onClose?.();
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
                placeholder="Search for people"
                onChange={(query: string) => searchUsers(query)}
              />
              <styled.List className="noScrollIndicator">
                {searchedUsers && searchedUsers.length > 0
                  ? searchedUsers.map((user) => (
                      <styled.Item key={user.id} onClick={() => handleUserClick(user.id)}>
                        <styled.Information>
                          <Avatar avatarSrc={user.avatarSrc} size="small" />
                          <Text size="s" text={user.name} transform="capitalized" />
                        </styled.Information>
                        {/*// TODO: information will come from isGuest flag from BE when things will be stable*/}
                        {!!nftStore.getNftByUuid(user.id) && (
                          <styled.RightToolbar>
                            {user.id === worldStore.worldId && (
                              <styled.AdminText size="s" text="Admin" />
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
                    ))
                  : !onlineUsersStore.query &&
                    users.map((user) => (
                      <styled.Item key={user.id} onClick={() => handleUserClick(user.id)}>
                        <styled.Information>
                          <Avatar avatarSrc={user.avatarSrc} size="small" />
                          <Text size="s" text={user.name} transform="capitalized" />
                        </styled.Information>
                        {/*// TODO: information will come from isGuest flag from BE when things will be stable*/}
                        {!!nftStore.getNftByUuid(user.id) && (
                          <styled.RightToolbar>
                            {user.id === worldStore.worldId && (
                              <styled.AdminText size="s" text="Admin" />
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
