import React, {FC, useEffect} from 'react';
import {t} from 'i18next';
import {useForm, Controller, SubmitHandler} from 'react-hook-form';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';

import {Dialog, Dropdown, Heading, Input, Text, ToastContent, TOAST_COMMON_OPTIONS} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {useDebouncedCallback} from 'ui-kit/hooks';
import {OptionInterface} from 'ui-kit';
import {validateEmail} from 'core/utils';

import * as styled from './AddMemberDialog.styled';

interface PropsInterface {
  onClose: () => void;
}

interface AddMemberFormInterface {
  role?: 'member' | 'admin';
  query: string;
}

const AddMemberDialog: FC<PropsInterface> = (props) => {
  const {
    mainStore: {worldStore},
    spaceAdminStore
  } = useStore();
  const {spaceManagerStore} = spaceAdminStore;
  const {spaceStore, searchUsersStore} = spaceManagerStore;

  const {
    control,
    handleSubmit,
    setError,
    formState: {errors}
  } = useForm<AddMemberFormInterface>({
    defaultValues: {
      role: undefined,
      query: ''
    }
  });

  const debouncedSearch = useDebouncedCallback((query: string) => {
    searchUsersStore.search(query, worldStore.worldId);
  }, 500);

  const formSubmitHandler: SubmitHandler<AddMemberFormInterface> = ({role, query}) => {
    if (searchUsersStore.selectedUserId) {
      spaceStore.addUser(searchUsersStore.selectedUserId, role === 'admin').then(() => {
        toast.info(
          <ToastContent
            headerIconName="alert"
            title={t('titles.alert')}
            text={t('spaceAdmin.users.addMemberDialog.success')}
            isCloseButton
          />,
          TOAST_COMMON_OPTIONS
        );

        spaceStore.fetchSpaceInformation();
        props.onClose();
      });
    } else if (validateEmail(query)) {
      spaceStore.inviteUser(query, role === 'admin').then(() => {
        toast.info(
          <ToastContent
            headerIconName="alert"
            title={t('titles.alert')}
            text={t('spaceAdmin.users.addMemberDialog.successInvite')}
            isCloseButton
          />,
          TOAST_COMMON_OPTIONS
        );

        props.onClose();
      });
    } else {
      setError('query', {
        message: t('spaceAdmin.users.addMemberDialog.query.errors.nonSelected')
      });
    }
  };

  const handleUserSelect = (option: OptionInterface, onChange: (value: string) => void) => {
    searchUsersStore.selectUser(option.value);
    onChange(option.label);
  };

  const handleQueryInputChange = (onChange: (value?: string) => void, newValue?: string) => {
    searchUsersStore.selectUser(undefined);
    searchUsersStore.hideResults();
    if (newValue && newValue.length > 1) {
      searchUsersStore.searchRequest.cancel();
      debouncedSearch(newValue);
    }
    onChange(newValue);
  };

  useEffect(() => {
    // Bug with mobx, without it showResults wouldn't force rerender
  }, [searchUsersStore.showResults]);

  // @ts-ignore: refactoring
  const renderQueryInput = ({field: {onChange, value}}) => (
    <styled.QueryContainer>
      <Input
        label={t('spaceAdmin.users.addMemberDialog.query.label')}
        value={value}
        onChange={(value) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          handleQueryInputChange(onChange, value);
        }}
        placeholder={t('spaceAdmin.users.addMemberDialog.query.placeholder')}
        errorMessage={errors.query?.message}
        isError={!!errors.query}
      />
      {searchUsersStore.showResults && value.length > 1 && (
        <Dropdown
          value=""
          variant="secondary"
          placeholder={t('spaceAdmin.users.addMemberDialog.query.dropdownPlaceholder')}
          options={searchUsersStore.results.map((result) => ({
            label: result.name,
            value: result.uuid
          }))}
          onOptionSelect={(option) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            handleUserSelect(option, onChange);
          }}
        />
      )}
    </styled.QueryContainer>
  );

  // @ts-ignore: refactoring
  const renderRoleInput = ({field: {onChange, value}}) => (
    <styled.InputContainer>
      <Heading
        label={t('spaceAdmin.users.addMemberDialog.dropdown.label')}
        type="h4"
        align="left"
        transform="uppercase"
        isCustom
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
    >
      <styled.Body>
        <Text
          text={t('spaceAdmin.users.addMemberDialog.message', {spaceName: spaceStore.space.name})}
          size="s"
        />
        <Controller
          control={control}
          name="query"
          render={renderQueryInput}
          rules={{
            required: {
              value: true,
              message: t('spaceAdmin.users.addMemberDialog.query.errors.required')
            }
          }}
        />
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
