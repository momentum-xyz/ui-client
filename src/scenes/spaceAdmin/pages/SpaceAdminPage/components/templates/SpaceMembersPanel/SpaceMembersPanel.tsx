import React, {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';
import {toast} from 'react-toastify';

import {SectionPanel, ToastContent, TOAST_COMMON_OPTIONS} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {AdminListItem} from 'scenes/spaceAdmin/pages/SpaceAdminPage/components/organisms';

import {RemoveUserConfirmationDialog, EditMemberDialog, AddMemberDialog} from './components';
import * as styled from './SpaceMembersPanel.styled';

const SpaceMembersPanel: FC = () => {
  const {spaceManagerStore} = useStore().spaceAdminStore;
  const {removeUserConfirmationDialog, editUserDialog, addUserDialog, space} = spaceManagerStore;

  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name?: string;
    isAdmin?: boolean;
  }>();

  const handleUserEdit = (userId: string, type?: string) => {
    setSelectedUser({id: userId, isAdmin: type === 'admin'});
    editUserDialog.open();
  };

  const handleUserRemove = (userId: string, name: string) => {
    setSelectedUser({id: userId, name});
    removeUserConfirmationDialog.open();
  };

  const removeUser = () => {
    if (!selectedUser) {
      return;
    }

    space
      ?.removeUser(selectedUser.id)
      .catch(() => {
        toast.error(
          <ToastContent
            isDanger
            headerIconName="alert"
            title={t('titles.alert')}
            text={t('spaceAdmin.users.removeConfirmation.failure')}
            showCloseButton
          />,
          TOAST_COMMON_OPTIONS
        );
      })
      .then(() => {
        space.fetchSpaceInformation();
        toast.info(
          <ToastContent
            headerIconName="alert"
            title={t('titles.alert')}
            text={t('spaceAdmin.users.removeConfirmation.success')}
            showCloseButton
          />,
          TOAST_COMMON_OPTIONS
        );
        removeUserConfirmationDialog.close();
      });
  };

  return (
    <SectionPanel title={t('spaceAdmin.users.title')} onAdd={addUserDialog.open}>
      {removeUserConfirmationDialog.isOpen && (
        <RemoveUserConfirmationDialog
          userName={selectedUser?.name ?? ''}
          onConfirmation={removeUser}
          onClose={removeUserConfirmationDialog.close}
        />
      )}
      {addUserDialog.isOpen && <AddMemberDialog onClose={addUserDialog.close} />}
      {editUserDialog.isOpen && (
        <EditMemberDialog
          userId={selectedUser?.id ?? ''}
          isAdmin={selectedUser?.isAdmin ?? false}
          onClose={editUserDialog.close}
        />
      )}
      <styled.List className="noScrollIndicator">
        {space?.users.map((user) => (
          <AdminListItem
            key={user.uuid}
            name={user.name}
            userId={user.uuid}
            type={user.isAdmin ? 'admin' : 'member'}
            onEdit={handleUserEdit}
            onRemove={handleUserRemove}
          />
        ))}
      </styled.List>
    </SectionPanel>
  );
};

export default observer(SpaceMembersPanel);
