import React, {FC} from 'react';
import {t} from 'i18next';
import {useForm, Controller, SubmitHandler} from 'react-hook-form';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {Dialog, Dropdown} from '@momentum/ui-kit';

import {ToastContent, TOAST_COMMON_OPTIONS} from 'ui-kit';
import {useStore} from 'shared/hooks';

import * as styled from './EditMemberDialog.styled';

interface PropsInterface {
  isAdmin: boolean;
  userId: string;
  onClose: () => void;
}

const EditMemberDialog: FC<PropsInterface> = (props) => {
  const {isAdmin, userId} = props;

  const {spaceManagerStore} = useStore().spaceAdminStore;
  const {space} = spaceManagerStore;

  const {control, handleSubmit} = useForm<{role: 'member' | 'admin'}>({
    defaultValues: {
      role: isAdmin ? 'admin' : 'member'
    }
  });

  const formSubmitHandler: SubmitHandler<{role: 'member' | 'admin'}> = ({role}) => {
    space?.editUser(userId, role === 'admin').then(() => {
      space?.fetchSpaceInformation();
      toast.info(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('spaceAdmin.users.editMemberDialog.success')}
          showCloseButton
        />,
        TOAST_COMMON_OPTIONS
      );
      props.onClose();
    });
  };

  // @ts-ignore
  const renderRoleInput = ({field: {onChange, value}}) => (
    <Dropdown
      value={value}
      variant="secondary"
      placeholder={t('spaceAdmin.users.editMemberDialog.dropdown.placeholder')}
      options={[
        {
          label: t('spaceAdmin.users.editMemberDialog.dropdown.member'),
          value: 'member'
        },
        {
          label: t('spaceAdmin.users.editMemberDialog.dropdown.admin'),
          value: 'admin'
        }
      ]}
      onOptionSelect={(option) => {
        onChange(option.value);
      }}
    />
  );

  return (
    <Dialog
      title={t('spaceAdmin.users.editMemberDialog.title')}
      approveInfo={{
        title: t('spaceAdmin.users.editMemberDialog.approveLabel'),
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick: handleSubmit(formSubmitHandler)
      }}
      declineInfo={{
        title: t('spaceAdmin.users.editMemberDialog.declineLabel'),
        onClick: props.onClose
      }}
      onClose={props.onClose}
      showCloseButton
    >
      <styled.Body>
        <Controller control={control} name="role" render={renderRoleInput} />
      </styled.Body>
    </Dialog>
  );
};

export default observer(EditMemberDialog);
