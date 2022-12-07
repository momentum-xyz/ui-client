import {observer} from 'mobx-react-lite';
import React, {FC, useEffect} from 'react';
import {Avatar, Dialog, SearchInput, Text} from '@momentum-xyz/ui-kit';

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
  const {mainStore, widgetsStore, nftStore} = useStore();
  const {unityStore} = mainStore;
  const {onlineUsersStore} = widgetsStore;

  useEffect(() => {
    unityStore.changeKeyboardControl(false);
    return () => {
      unityStore.changeKeyboardControl(true);
    };
  }, [unityStore]);

  useEffect(() => {
    console.info(users);
    console.info(searchedUsers);
  }, []);

  const handleClose = () => {
    onClose?.();
    searchUsers('');
  };

  const handleUserClick = (id: string) => {
    if (onlineUsersStore?.selectedUserId !== id) {
      onlineUsersStore?.selectUser(nftStore.nftItems, id);
    } else {
      onlineUsersStore?.unselectUser();
    }
  };

  return (
    <>
      <Dialog
        title="Online"
        onClose={handleClose}
        headerStyle="uppercase"
        icon="people"
        iconSize="large"
        showCloseButton
        showOverflow
        layoutSize={{width: `${DIALOG_WIDTH_PX}px;`}}
      >
        <styled.Container data-testid="SearchUsersWidget-test">
          <SearchInput placeholder="Search for people" onChange={(query) => searchUsers(query)} />
          <styled.List className="noScrollIndicator">
            {searchedUsers && searchedUsers.length > 0
              ? searchedUsers.map((user) => (
                  <styled.Item key={user.id} onClick={() => handleUserClick(user.id)}>
                    <Avatar avatarSrc={user.avatarSrc} size="small" />
                    <Text size="s" text={user.name} transform="capitalized" />
                  </styled.Item>
                ))
              : users.map((user) => (
                  <styled.Item key={user.id} onClick={() => handleUserClick(user.id)}>
                    <Avatar avatarSrc={user.avatarSrc} size="small" />
                    <Text size="s" text={user.name} transform="capitalized" />
                  </styled.Item>
                ))}
          </styled.List>
        </styled.Container>
      </Dialog>
      <styled.UsersContainer>
        {onlineUsersStore.selectedUserId && (
          <UserProfilePanel
            odyssey={onlineUsersStore.odyssey}
            onClose={onlineUsersStore.unselectUser}
            nftId={onlineUsersStore.nftId}
          />
        )}
        {/*    {onlineUsersStore.selectedUserId && (*/}
        {/*      <div>*/}
        {/*        <UserProfilePanel*/}
        {/*          userId={onlineUsersStore.selectedUserId}*/}
        {/*          onClose={() => {*/}
        {/*            onlineUsersStore.unselectUser();*/}
        {/*            userProfileDialog.close();*/}
        {/*          }}*/}
        {/*        />*/}
        {/*      </div>*/}
        {/*    )}*/}
      </styled.UsersContainer>
    </>
  );
};

export default observer(SearchUsersWidget);
