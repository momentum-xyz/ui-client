import React, {useCallback, useRef, useState} from 'react';
import {toast} from 'react-toastify';
import {t} from 'i18next';

import {ToastContent, TOAST_COMMON_OPTIONS} from 'ui-kit';

import Panel, {PanelBody, PanelTitle} from '../../../component/atoms/Panel';
import TopbarButton from '../../../component/atoms/topbar/TopbarButton';
import {ReactComponent as TrashIcon} from '../../../images/icons/trash.svg';
import {ReactComponent as PencilIcon} from '../../../images/icons/pencil.svg';
import {AddUserPopup} from '../popups/AddUserPopup';
import Modal, {ModalRef} from '../../../component/util/Modal';
import {useConfirmationDialog} from '../../../hooks/useConformationDialog';
import {EditUserPopup} from '../popups/EditUserPopup';
import {Space} from '../../../context/type/Space';
import {
  AssignUserDTO,
  useAssignUserToSpace,
  useUnAssignUserToSpace
} from '../../../hooks/api/useSpaceService';
import {bytesToUuid} from '../../../core/utils/uuid.utils';
import {InviteUserByEmailDTO, useInviteUserToSpace} from '../../../hooks/api/useUserService';

export interface UsersPanelViewProps {
  space: Space;
  onUpdate: () => void;
}

export const UsersPanelView: React.FC<UsersPanelViewProps> = ({space, onUpdate}) => {
  const addUserModal = useRef<ModalRef>(null);
  const editMemberModal = useRef<ModalRef>(null);

  const [editMember, setEditMember] = useState<AssignUserDTO>();

  const {getConfirmation} = useConfirmationDialog();

  const [assignUserToSpace] = useAssignUserToSpace();
  const [unassignUserToSpace] = useUnAssignUserToSpace();
  const [inviteUserToSpace] = useInviteUserToSpace();

  const addUser = () => {
    addUserModal.current?.open();
  };

  const saveUser = (userId: string, isAdmin: boolean) => {
    const addUser: AssignUserDTO = {
      spaceId: bytesToUuid(space.id.data),
      userId: userId,
      isAdmin: isAdmin
    };

    if (addUser) {
      assignUserToSpace(addUser).then(() => {
        onUpdate();
        toast.info(
          <ToastContent
            headerIconName="alert"
            title={t('titles.alert')}
            text={t('messages.memberAddSuccess')}
            isCloseButton
          />,
          TOAST_COMMON_OPTIONS
        );
      });
      addUserModal.current?.close();
    }
  };

  const sendEmail = (email: string, isAdmin: boolean) => {
    const inviteUser: InviteUserByEmailDTO = {
      spaceId: bytesToUuid(space.id.data),
      email,
      isAdmin
    };

    if (inviteUser) {
      inviteUserToSpace(inviteUser).then(() => {
        toast.info(
          <ToastContent
            headerIconName="alert"
            title={t('titles.alert')}
            text={t('messages.invitationSendSuccess')}
            isCloseButton
          />,
          TOAST_COMMON_OPTIONS
        );
      });

      addUserModal.current?.close();
    }
  };

  const saveEdit = (user: AssignUserDTO) => {
    if (user) {
      assignUserToSpace(user).then(() => {
        onUpdate();
        toast.info(
          <ToastContent
            headerIconName="alert"
            title={t('titles.alert')}
            text={t('messages.memberRoleEditSuccess')}
            isCloseButton
          />,
          TOAST_COMMON_OPTIONS
        );
      });
      editMemberModal.current?.close();
    }
  };

  const removeUser = (user) => {
    const removeUser: AssignUserDTO = {
      spaceId: bytesToUuid(space.id.data),
      userId: bytesToUuid(user.user.id.data),
      isAdmin: user.isAdmin
    };

    if (removeUser) {
      unassignUserToSpace(removeUser)
        .then(() => {
          onUpdate();
          toast.info(
            <ToastContent
              headerIconName="alert"
              title={t('titles.alert')}
              text={t('messages.memberRemoveSuccess')}
              isCloseButton
            />,
            TOAST_COMMON_OPTIONS
          );
        })
        .catch((error) => {
          console.error(error);
          toast.error(
            <ToastContent
              isDanger
              headerIconName="alert"
              title={t('titles.alert')}
              text={t('messages.memberRemoveFailure')}
              isCloseButton
            />,
            TOAST_COMMON_OPTIONS
          );
        });
    }
  };

  const confirmRemoveUser = useCallback(
    (user) => {
      getConfirmation({
        blockInterface: true,
        title: 'Remove member from space',
        message: 'Are you sure you want to remove the ' + user?.user?.name + ' from this space?',
        confirmButton: 'Yes, remove',
        cancelButton: 'No, cancel'
      }).then((result) => {
        if (result) {
          removeUser(user);
        }
      });
    },
    [getConfirmation]
  );

  const editUser = (user) => {
    setEditMember({
      spaceId: bytesToUuid(space.id.data),
      userId: bytesToUuid(user.user.id.data),
      isAdmin: user.isAdmin
    });
    editMemberModal.current?.open();
  };

  const userlist = () => {
    const rows = space.userSpaces?.map((item, i) => (
      <div
        key={i}
        className="w-full flex items-start justify-between p-2 border-b-1 border-black-50"
      >
        <div className="flex-1 truncate">
          <h3
            className="text-prime-blue-100 text-base font-bold font-sans truncate"
            title="Jane Cooper"
          >
            {item.user.name}
          </h3>
          <p className="mt-1 text-white-1000 text-base font-sans font-medium truncate">
            {item.isAdmin ? 'Admin' : 'Member'}
          </p>
        </div>
        <div className="flex">
          <TopbarButton title="Edit member" onClick={() => editUser(item)}>
            <PencilIcon className="text-prime-blue-100" />
          </TopbarButton>
          <TopbarButton title="Remove member" onClick={() => confirmRemoveUser(item)}>
            <TrashIcon className="text-prime-blue-100" />
          </TopbarButton>
        </div>
      </div>
    ));

    return rows;
  };

  return (
    <>
      <Panel>
        <PanelTitle onAddAction={addUser} addLabel="Add member">
          Space members
        </PanelTitle>

        <PanelBody scroll={true}>{userlist()}</PanelBody>
      </Panel>

      <Modal ref={addUserModal}>
        <AddUserPopup
          onClose={() => addUserModal.current?.close()}
          onSave={saveUser}
          onEmailSend={sendEmail}
          spaceName={space?.name}
        />
      </Modal>

      <Modal ref={editMemberModal}>
        {editMember && (
          <EditUserPopup
            onClose={() => editMemberModal.current?.close()}
            onSave={saveEdit}
            user={editMember}
          />
        )}
      </Modal>
    </>
  );
};
