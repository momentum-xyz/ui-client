import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';
import {
  SearchInput,
  useDebouncedEffect,
  SEARCH_MINIMAL_CHARACTER_COUNT
} from '@momentum-xyz/ui-kit';

import {OnlineUsersListInterface, UserModelInterface} from 'core/models';
import {OnlineUsersStoreType} from 'scenes/home/stores/HomeStore/models';

import {UserItem} from './components';
import * as styled from './OnlineUsersList.styled';

export interface PropsInterface {
  invite?: boolean;
  worldId: string;
  onlineUsersStore?: OnlineUsersStoreType;
  changeKeyboardControl: (active: boolean) => void;
  user?: UserModelInterface;
  teleportToUser: (userId: string) => void;
  spaceId: string;
  onlineUsersList: OnlineUsersListInterface;
  excludedPeople?: string[];
}

const OnlineUsersList: React.FC<PropsInterface> = ({
  invite = false,
  worldId,
  onlineUsersList,
  onlineUsersStore,
  user,
  teleportToUser,
  changeKeyboardControl,
  spaceId,
  excludedPeople = []
}) => {
  const {t} = useTranslation();

  useDebouncedEffect(
    () => {
      if (!user) {
        return;
      }

      if (onlineUsersList.searchQuery.length >= SEARCH_MINIMAL_CHARACTER_COUNT) {
        onlineUsersList.searchUsers(worldId, true, user.id, !invite);
      } else {
        onlineUsersList.fetchUsers(worldId, user.id, !invite);
      }
    },
    200,
    [onlineUsersList.searchQuery, worldId]
  );

  useEffect(() => {
    if (!user) {
      return;
    }

    onlineUsersList.setSearchQuery('');
    onlineUsersList.fetchUsers(worldId, user.id, !invite);

    const timeInterval = setInterval(() => {
      if (onlineUsersList.searchQuery.length < SEARCH_MINIMAL_CHARACTER_COUNT) {
        onlineUsersList.fetchUsers(worldId, user.id, !invite);
      }
    }, 30000);

    return () => clearInterval(timeInterval);
  }, [invite, onlineUsersList, user, worldId]);

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

  return (
    <styled.Container data-testid="OnlineUsersList-test">
      <SearchInput
        value={onlineUsersList.searchQuery}
        onChange={onlineUsersList.setSearchQuery}
        placeholder={t('placeholders.searchForPeople')}
        onFocus={() => handleSearchFocus(true)}
        onBlur={() => handleSearchFocus(false)}
      />
      <styled.List>
        {onlineUsersList.filteredPeople(excludedPeople).map((onlineUser) => (
          <UserItem
            key={onlineUser.id}
            user={onlineUser}
            onClick={() => handleClick(onlineUser.id)}
            invite={invite}
            currentUser={user}
            teleportToUser={teleportToUser}
            spaceId={spaceId}
          />
        ))}
      </styled.List>
    </styled.Container>
  );
};

export default observer(OnlineUsersList);
