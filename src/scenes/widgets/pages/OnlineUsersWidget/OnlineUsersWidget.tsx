import React, {FC, useEffect} from 'react';
import {Position} from 'react-beautiful-dnd';
import {observer} from 'mobx-react-lite';

import {SocialOnlineUsersList} from 'scenes/widgets/pages/OnlineUsersWidget/components/SocialOnlineUsersList';
import SocialPanel from 'component/molucules/socialui/SocialPanel';
import useUnityEvent from 'context/Unity/hooks/useUnityEvent';
import {useStore} from 'shared/hooks';
import {IconSvg} from 'ui-kit';

import {ProfileEditWidget} from '../ProfileEditWidget';
import {ProfileWidget} from '../ProfileWidget';

import * as styled from './OnlineUsersWidget.styled';

interface OnlineUsersWidgetsProps {
  // TODO: Move selecting to spaces panel store when refactoring it
  onUserInitiativeSelect: (Buffer) => void;
}

const OnlineUsersWidget: FC<OnlineUsersWidgetsProps> = ({onUserInitiativeSelect}) => {
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
    )
      return;

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
      {/*TODO: Refactor to new structure*/}
      <SocialPanel
        title="People"
        headerIcon={<IconSvg name="people" />}
        isOpen={onlineUsersStore.expanded}
        setIsOpen={onlineUsersStore.toggleExpand}
        position="right"
        detailView={
          onlineUsersStore.selectedUserId && (
            <div className="max-h-full">
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
          )
        }
      >
        {onlineUsersStore.expanded && <SocialOnlineUsersList />}
      </SocialPanel>
    </styled.Container>
  );
};

export default observer(OnlineUsersWidget);
