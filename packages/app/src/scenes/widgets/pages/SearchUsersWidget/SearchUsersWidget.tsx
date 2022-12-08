import {observer} from 'mobx-react-lite';
import React, {FC, useEffect} from 'react';
import {Avatar, IconSvg, PanelLayout, Portal, SearchInput, Text} from '@momentum-xyz/ui-kit';

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
    unityStore.loadWorldById(worldId, authStore.token);
  };

  // TODO: uncomment when high five works from unity and BE side
  const handleHighFive = (worldId: string) => {
    // unityStore.sendHighFive(worldId);
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
                            <IconSvg name="fly-to" onClick={() => handleTeleport(user?.id || '')} />
                            <IconSvg name="high-five" />
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
                            <IconSvg name="fly-to" onClick={() => handleTeleport(user?.id || '')} />
                            <IconSvg name="high-five" />
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
