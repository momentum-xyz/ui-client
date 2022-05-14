import React, {FC} from 'react';
import {t} from 'i18next';
import {useForm, Controller, SubmitHandler} from 'react-hook-form';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';

import {Dialog, Dropdown, ToastContent, TOAST_COMMON_OPTIONS} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {TokenRuleRoles} from 'core/enums';

import * as styled from './EditTokenRuleDialog.styled';

interface PropsInterface {
  isAdmin: boolean;
  tokenGroupUserId: string;
  onClose: () => void;
}

const EditTokenRuleDialog: FC<PropsInterface> = (props) => {
  const {isAdmin, tokenGroupUserId} = props;

  const {spaceManagerStore} = useStore().spaceAdminStore;
  const {spaceStore} = spaceManagerStore;

  const {control, handleSubmit} = useForm<{role: TokenRuleRoles.MEMBER | TokenRuleRoles.ADMIN}>({
    defaultValues: {
      role: isAdmin ? TokenRuleRoles.MEMBER : TokenRuleRoles.ADMIN
    }
  });

  const formSubmitHandler: SubmitHandler<{
    role: TokenRuleRoles.MEMBER | TokenRuleRoles.ADMIN;
  }> = async ({role}) => {
    spaceStore.editUser(tokenGroupUserId, role === TokenRuleRoles.ADMIN).then(() => {
      toast.info(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('spaceAdmin.users.editMemberDialog.success')}
          isCloseButton
        />,
        TOAST_COMMON_OPTIONS
      );
      props.onClose();
    });
  };

  const renderRoleInput = ({field: {onChange, value}}) => (
    <Dropdown
      value={value}
      placeholder=""
      variant="secondary"
      options={[
        {
          label: t('tokenRules.memberLabel'),
          value: TokenRuleRoles.MEMBER
        },
        {
          label: t('tokenRules.adminLabel'),
          value: TokenRuleRoles.ADMIN
        }
      ]}
      onOptionSelect={(option) => {
        onChange(option.value);
      }}
    />
  );

  return (
    <Dialog
      title={t('tokenRules.editTokenRuleDialog.title')}
      approveInfo={{
        title: t('actions.save'),
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick: handleSubmit(formSubmitHandler)
      }}
      declineInfo={{
        title: t('actions.cancel'),
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

export default observer(EditTokenRuleDialog);
