import React, {FC, useState} from 'react';
import {t} from 'i18next';
import {useForm, Controller, SubmitHandler} from 'react-hook-form';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {Dialog, Dropdown, Text, SearchDropdown, useDebouncedCallback} from '@momentum/ui-kit';

import {ToastContent, TOAST_COMMON_OPTIONS} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {validateEmail} from 'core/utils';
import {UserModelInterface} from 'core/models/UserModel';

import * as styled from './AddMemberDialog.styled';

interface PropsInterface {
  onClose: () => void;
}

interface AddMemberFormInterface {
  role?: 'member' | 'admin';
  user: string;
}

const AddMemberDialog: FC<PropsInterface> = (props) => {
  const {
    mainStore: {worldStore},
    spaceAdminStore
  } = useStore();
  const {spaceManagerStore} = spaceAdminStore;
  const {space, searchUsersStore} = spaceManagerStore;
  const [isFocused, setIsFocused] = useState(false);
  const [userSelected, setUserSelected] = useState<string>('');

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: {errors}
  } = useForm<AddMemberFormInterface>({
    defaultValues: {
      role: undefined,
      user: ''
    }
  });

  const formSubmitHandler: SubmitHandler<AddMemberFormInterface> = ({role, user}) => {
    if (searchUsersStore.selectedUserId) {
      space?.addUser(searchUsersStore.selectedUserId, role === 'admin').then(() => {
        toast.info(
          <ToastContent
            headerIconName="alert"
            title={t('titles.alert')}
            text={t('spaceAdmin.users.addMemberDialog.successAdd')}
            showCloseButton
          />,
          TOAST_COMMON_OPTIONS
        );

        space.fetchSpaceInformation();
        props.onClose();
      });
    } else if (validateEmail(user)) {
      space?.inviteUser(user, role === 'admin').then(() => {
        toast.info(
          <ToastContent
            headerIconName="alert"
            title={t('titles.alert')}
            text={t('spaceAdmin.users.addMemberDialog.successInvite')}
            showCloseButton
          />,
          TOAST_COMMON_OPTIONS
        );

        props.onClose();
      });
    } else {
      setError('user', {
        message: t('spaceAdmin.users.addMemberDialog.query.errors.nonSelected')
      });
    }
  };

  const handleSelectUser = (user: UserModelInterface) => {
    setIsFocused(false);
    setIsFocused(false);
    setValue('user', user.id);
    searchUsersStore.selectUser(user.id);
    setUserSelected(user.name);
  };

  const debounceSearch = useDebouncedCallback((query: string) => {
    searchUsersStore.search(query, worldStore.worldId);
  }, 500);

  const handleSearch = (value: string) => {
    searchUsersStore.selectUser(undefined);
    searchUsersStore.hideResults();
    if (value && value.length > 1) {
      searchUsersStore.searchRequest.cancel();
      debounceSearch(value);
    } else {
      searchUsersStore.resetModel();
    }
  };

  // @ts-ignore: refactoring
  const renderRoleInput = ({field: {onChange, value}}) => (
    <styled.InputContainer>
      <styled.DropdownHeading
        label={t('spaceAdmin.users.addMemberDialog.dropdown.label')}
        type="h4"
        align="left"
        transform="uppercase"
      />
      <Dropdown
        value={value ?? ''}
        variant="secondary"
        placeholder={t('spaceAdmin.users.addMemberDialog.dropdown.placeholder')}
        options={[
          {
            label: t('spaceAdmin.users.addMemberDialog.dropdown.member'),
            value: 'member'
          },
          {
            label: t('spaceAdmin.users.addMemberDialog.dropdown.admin'),
            value: 'admin'
          }
        ]}
        onOptionSelect={(option) => {
          onChange(option.value);
        }}
      />
      {errors.role && <styled.ErrorMessage>{errors.role.message}</styled.ErrorMessage>}
    </styled.InputContainer>
  );

  return (
    <Dialog
      title={t('spaceAdmin.users.addMemberDialog.title')}
      approveInfo={{
        title: t('spaceAdmin.users.addMemberDialog.approveLabel'),
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick: handleSubmit(formSubmitHandler)
      }}
      declineInfo={{
        title: t('spaceAdmin.users.addMemberDialog.declineLabel'),
        onClick: props.onClose
      }}
      onClose={props.onClose}
      showCloseButton
      closeOnBackgroundClick={false}
      hasBorder
    >
      <styled.Body>
        <styled.TextRow>
          <Text text={t('spaceAdmin.users.addMemberDialog.message')} align="left" size="s" />
        </styled.TextRow>
        <styled.QueryContainer>
          <SearchDropdown
            data={searchUsersStore.resultsList.slice()}
            onClick={handleSelectUser}
            value={userSelected}
            setValue={setUserSelected}
            isFocused={isFocused}
            setIsFocused={setIsFocused}
            search={handleSearch}
            searchInputLabel={t('spaceAdmin.users.addMemberDialog.query.label')}
            searchInputPlaceholder={t('spaceAdmin.users.addMemberDialog.query.placeholder')}
            height="10vh"
          />
        </styled.QueryContainer>
        <Controller
          control={control}
          name="role"
          render={renderRoleInput}
          rules={{
            required: {
              value: true,
              message: t('spaceAdmin.users.addMemberDialog.dropdown.errors.required')
            }
          }}
        />
      </styled.Body>
    </Dialog>
  );
};

export default observer(AddMemberDialog);
