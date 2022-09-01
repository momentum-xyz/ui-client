import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import {SearchInput, useDebouncedEffect} from 'ui-kit';
import {OnlineUsersListInterface, UserProfileModelInterface} from 'core/models';
import {SEARCH_MINIMAL_CHARACTER_COUNT} from 'core/constants';
import {OnlineUsersStoreInterface} from 'scenes/home/stores/HomeStore/models';

import {UserItem} from './components';
import * as styled from './OnlineUsersList.styled';

export interface PropsInterface {
  invite?: boolean;
  worldId: string;
  onlineUsersStore?: OnlineUsersStoreInterface;
  changeKeyboardControl: (active: boolean) => void;
  profile?: UserProfileModelInterface;
  teleportToUser: (userId: string) => void;
  spaceId: string;
  onlineUsersList: OnlineUsersListInterface;
}

const OnlineUsersList: React.FC<PropsInterface> = ({
  invite = false,
  worldId,
  onlineUsersList,
  onlineUsersStore,
  profile,
  teleportToUser,
  changeKeyboardControl,
  spaceId
}) => {
  const {t} = useTranslation();

  useDebouncedEffect(
    () => {
      if (onlineUsersList.searchQuery.length >= SEARCH_MINIMAL_CHARACTER_COUNT) {
        onlineUsersList.searchUsers(worldId, true);
      }
    },
    200,
    [onlineUsersList.searchQuery, worldId]
  );

  useEffect(() => {
    onlineUsersList.setSearchQuery('');
    onlineUsersList.fetchUsers(worldId);
    const timeInterval = setInterval(() => {
      onlineUsersList.fetchUsers(worldId);
    }, 30000);

    return () => clearInterval(timeInterval);
  }, []);

  const handleClick = (id: string) => {
    if (onlineUsersStore?.selectedUserId !== id) {
      onlineUsersStore?.selectUser(id);
    } else {
      onlineUsersStore?.unselectUser();
    }
  };

  const handleSearchFocus = (isFocused: boolean) => {
    if (isFocused) {
      changeKeyboardControl(false);
    } else {
      changeKeyboardControl(true);
    }
  };

  const renderList = () => {
    if (!onlineUsersList.users || !profile) {
      return;
    }

    if (onlineUsersList.searchQuery.length >= SEARCH_MINIMAL_CHARACTER_COUNT) {
      return onlineUsersList.searchedUsers
        .filter((user) => (invite ? user.uuid !== profile?.uuid : true))
        .map((user) => (
          <UserItem
            user={user}
            key={user.uuid}
            onClick={() => handleClick(user.uuid)}
            invite={invite}
            profile={profile}
            spaceId={spaceId}
          />
        ));
    }

    const sortedUsers: UserProfileModelInterface[] = [
      ...(invite ? [] : onlineUsersList.users.filter((user) => user.uuid === profile.uuid)),
      ...onlineUsersList.users.filter((user) => user.uuid !== profile.uuid)
    ];

    return sortedUsers.map((user) => (
      <UserItem
        key={user.uuid}
        user={user}
        onClick={() => handleClick(user.uuid)}
        invite={invite}
        profile={profile}
        teleportToUser={teleportToUser}
        spaceId={spaceId}
      />
    ));
  };

  return (
    <styled.Container data-testid="OnlineUsersList-test">
      <SearchInput
        value={onlineUsersList.searchQuery}
        onChange={onlineUsersList.setSearchQuery}
        placeholder={t('placeholders.searchForPeople')}
        onFocus={() => handleSearchFocus(true)}
        onBlur={() => handleSearchFocus(false)}
      />
      <styled.List>{renderList()}</styled.List>
    </styled.Container>
  );
};

export default observer(OnlineUsersList);
