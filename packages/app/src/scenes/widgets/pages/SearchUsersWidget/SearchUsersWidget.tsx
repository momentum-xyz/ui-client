import {observer} from 'mobx-react-lite';
import React, {FC, useEffect} from 'react';
import {Avatar, PanelLayout, Portal, SearchInput, Text} from '@momentum-xyz/ui-kit';

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
  const {mainStore, widgetsStore, nftStore, authStore} = useStore();
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

  const handleUserClick = (id: string) => {
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
                        {user.id === worldStore.worldId && <Text size="s" text="Admin" />}
                      </styled.Item>
                    ))
                  : !onlineUsersStore.query &&
                    users.map((user) => (
                      <styled.Item key={user.id} onClick={() => handleUserClick(user.id)}>
                        <styled.Information>
                          <Avatar avatarSrc={user.avatarSrc} size="small" />
                          <Text size="s" text={user.name} transform="capitalized" />
                        </styled.Information>
                        {user.id === worldStore.worldId && <Text size="s" text="Admin" />}
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
                onClose={onlineUsersStore.unselectUser}
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
