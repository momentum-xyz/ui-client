import React, {useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';

import {useStore} from 'shared/hooks';
import {SearchInput, useDebouncedEffect} from 'ui-kit';
import {UserProfileModelInterface} from 'core/models';
import {SEARCH_MINIMAL_CHARACTER_COUNT} from 'core/constants';
import {SocialUserItem} from 'scenes/widgets/pages/OnlineUsersWidget/components/SocialUserItem';

import * as styled from './SocialOnlineUsersList.styled';

export interface SocialOnlineUsersListProps {
  invite?: boolean;
}

const SocialOnlineUsersList: React.FC<SocialOnlineUsersListProps> = ({invite = false}) => {
  const {
    sessionStore,
    mainStore: {worldStore, unityStore},
    widgetStore: {onlineUsersStore}
  } = useStore();
  const {profile} = sessionStore;

  useDebouncedEffect(
    () => {
      if (onlineUsersStore.searchQuery.length >= SEARCH_MINIMAL_CHARACTER_COUNT) {
        onlineUsersStore.searchUsers(worldStore.worldId, true);
      }
    },
    200,
    [onlineUsersStore.searchQuery, worldStore.worldId]
  );

  useEffect(() => {
    onlineUsersStore.setSearchQuery('');
    onlineUsersStore.fetchUsers(worldStore.worldId);
    const timeInterval = setInterval(() => {
      onlineUsersStore.fetchUsers(worldStore.worldId);
    }, 30000);

    return () => clearInterval(timeInterval);
  }, []);

  const handleClick = (id: string) => {
    if (onlineUsersStore.selectedUserId !== id) {
      onlineUsersStore.selectUser(id);
    } else {
      onlineUsersStore.unselectUser();
    }
  };

  const handleSearchFocus = (isFocused: boolean) => {
    if (isFocused) {
      unityStore.changeKeyboardControl(false);
    } else {
      unityStore.changeKeyboardControl(true);
    }
  };

  const renderList = () => {
    if (!onlineUsersStore.users || !profile) {return;}

    if (onlineUsersStore.searchQuery.length >= SEARCH_MINIMAL_CHARACTER_COUNT) {
      return onlineUsersStore.searchedUsers
        .filter((user) => (invite ? user.uuid !== profile?.uuid : true))
        .map((user) => (
          <SocialUserItem
            user={user}
            key={user.uuid}
            currentUserId={profile.uuid}
            onClick={() => handleClick(user.uuid)}
            invite={invite}
          />
        ));
    }

    const sortedUsers: UserProfileModelInterface[] = [
      ...(invite ? [] : onlineUsersStore.users.filter((user) => user.uuid === profile.uuid)),
      ...onlineUsersStore.users.filter((user) => user.uuid !== profile.uuid)
    ];

    return sortedUsers.map((user) => (
      <SocialUserItem
        key={user.uuid}
        currentUserId={profile.uuid}
        user={user}
        onClick={() => handleClick(user.uuid)}
        invite={invite}
      />
    ));
  };

  return (
    <styled.Container>
      <SearchInput
        value={onlineUsersStore.searchQuery}
        onChange={onlineUsersStore.setSearchQuery}
        placeholder={t('placeholders.searchForPeople')}
        onFocus={() => handleSearchFocus(true)}
        onBlur={() => handleSearchFocus(false)}
      />
      <styled.List>{renderList()}</styled.List>
    </styled.Container>
  );
};

export default observer(SocialOnlineUsersList);
