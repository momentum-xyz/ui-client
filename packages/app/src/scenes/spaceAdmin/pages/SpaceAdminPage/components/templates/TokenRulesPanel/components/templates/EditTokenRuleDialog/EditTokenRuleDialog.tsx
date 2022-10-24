import React, {FC} from 'react';
import {t} from 'i18next';
import {useForm, Controller, SubmitHandler} from 'react-hook-form';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {Dialog, Dropdown} from '@momentum-xyz/ui-kit';

import {ToastContent, TOAST_COMMON_OPTIONS} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {TokenRuleRolesEnum} from 'core/enums';

import * as styled from './EditTokenRuleDialog.styled';

interface PropsInterface {
  isAdmin: boolean;
  tokenGroupUserId: string;
  onClose: () => void;
}

const EditTokenRuleDialog: FC<PropsInterface> = (props) => {
  const {isAdmin, tokenGroupUserId} = props;

  const {spaceManagerStore} = useStore().spaceAdminStore;
  const {space} = spaceManagerStore;

  const {control, handleSubmit} = useForm<{
    role: TokenRuleRolesEnum.MEMBER | TokenRuleRolesEnum.ADMIN;
  }>({
    defaultValues: {
      role: isAdmin ? TokenRuleRolesEnum.MEMBER : TokenRuleRolesEnum.ADMIN
    }
  });

  const formSubmitHandler: SubmitHandler<{
    role: TokenRuleRolesEnum.MEMBER | TokenRuleRolesEnum.ADMIN;
  }> = async ({role}) => {
    space?.editUser(tokenGroupUserId, role === TokenRuleRolesEnum.ADMIN).then(() => {
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
      placeholder=""
      variant="secondary"
      options={[
        {
          label: t('tokenRules.memberLabel'),
          value: TokenRuleRolesEnum.MEMBER
        },
        {
          label: t('tokenRules.adminLabel'),
          value: TokenRuleRolesEnum.ADMIN
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
