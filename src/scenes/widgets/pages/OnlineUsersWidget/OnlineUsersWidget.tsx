import React, {FC, useEffect} from 'react';
import {Position} from 'react-beautiful-dnd';
import {observer} from 'mobx-react-lite';

import {SocialOnlineUsersList} from 'scenes/widgets/pages/OnlineUsersWidget/components/SocialOnlineUsersList';
import useUnityEvent from 'context/Unity/hooks/useUnityEvent';
import {useStore} from 'shared/hooks';
import {ExpandableLayout} from 'ui-kit';
import {ProfileEditWidget, ProfileWidget} from 'scenes/widgets/pages';

import * as styled from './OnlineUsersWidget.styled';

interface OnlineUsersWidgetsPropsInterface {
  // TODO: Move selecting to spaces panel store when refactoring it
  onUserInitiativeSelect: (initiativeId: Buffer) => void;
}

const OnlineUsersWidget: FC<OnlineUsersWidgetsPropsInterface> = ({onUserInitiativeSelect}) => {
  const {
    sessionStore,
    widgetStore: {profileMenuStore, onlineUsersStore}
  } = useStore();
  const {profile} = sessionStore;
  const {profileDialog} = profileMenuStore;

  useUnityEvent('ProfileClickEvent', (id: string, position: Position) => {
    onlineUsersStore.selectUser(id);
    console.info('position', position);
  });

  useEffect(() => {
    if (
      onlineUsersStore.selectedUserId &&
      profile &&
      onlineUsersStore.selectedUserId === profile.uuid
    ) {
      return;
    }

    if (profileDialog.isOpen && profile) {
      onlineUsersStore.selectUser(profile.uuid);
    }
  }, [profileDialog.isOpen]);

  useEffect(() => {
    if (onlineUsersStore.selectedUserId !== profile?.uuid) {
      onlineUsersStore.endEditingUser();
      profileDialog.close();
    }
  }, [onlineUsersStore.selectedUserId]);

  const handleUserEdit = (userId: string) => {
    onlineUsersStore.editUser(userId);
  };

  return (
    <styled.Container>
      {onlineUsersStore.selectedUserId && (
        <div>
          {onlineUsersStore.editedUserId ? (
            <ProfileEditWidget
              userId={onlineUsersStore.editedUserId}
              onClose={onlineUsersStore.endEditingUser}
            />
          ) : (
            <ProfileWidget
              userId={onlineUsersStore.selectedUserId}
              onClose={() => {
                onlineUsersStore.unselectUser();
                profileDialog.close();
              }}
              onUserInitiativeSelect={onUserInitiativeSelect}
              onEditUser={handleUserEdit}
            />
          )}
        </div>
      )}
      <ExpandableLayout
        name="People"
        iconName="people"
        isExpanded={onlineUsersStore.expanded}
        setExpand={onlineUsersStore.toggleExpand}
        size={{width: '200px'}}
      >
        <SocialOnlineUsersList />
      </ExpandableLayout>
    </styled.Container>
  );
};

export default observer(OnlineUsersWidget);
