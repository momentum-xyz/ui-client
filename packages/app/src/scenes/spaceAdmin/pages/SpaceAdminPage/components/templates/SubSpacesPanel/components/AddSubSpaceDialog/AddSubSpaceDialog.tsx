import React, {FC, useEffect} from 'react';
import {t} from 'i18next';
import {useForm, Controller, SubmitHandler} from 'react-hook-form';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {Dialog, Dropdown, Input} from '@momentum/ui-kit';

import {ToastContent, TOAST_COMMON_OPTIONS} from 'ui-kit';
import {useStore} from 'shared/hooks';

import * as styled from './AddSubSpaceDialog.styled';

interface PropsInterface {
  parentId: string;
  onClose: () => void;
  allowedSubSpaceTypes: string[];
}

const AddSubSpaceDialog: FC<PropsInterface> = (props) => {
  const {parentId, allowedSubSpaceTypes} = props;

  const {spaceManagerStore} = useStore().spaceAdminStore;
  const {space} = spaceManagerStore;

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors}
  } = useForm<{type: string; name: string}>();

  const formSubmitHandler: SubmitHandler<{type: string; name: string}> = ({type, name}) => {
    space?.addSubSpace(parentId, name, type).then(() => {
      space?.fetchSpaceInformation();

      toast.info(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('messages.subSpaceCreateSuccess')}
          showCloseButton
        />,
        TOAST_COMMON_OPTIONS
      );

      props.onClose();
    });
  };

  useEffect(() => {
    if (allowedSubSpaceTypes.length > 0) {
      setValue('type', allowedSubSpaceTypes[0]);
    }
  }, [allowedSubSpaceTypes, setValue]);

  return (
    <Dialog
      title={t('spaceAdmin.subSpaces.addSubSpaceDialog.title')}
      approveInfo={{
        title: t('spaceAdmin.subSpaces.addSubSpaceDialog.approveLabel'),
        onClick: handleSubmit(formSubmitHandler)
      }}
      declineInfo={{
        title: t('spaceAdmin.subSpaces.addSubSpaceDialog.declineLabel'),
        onClick: props.onClose
      }}
      onClose={props.onClose}
      showCloseButton
    >
      <styled.Body>
        <Controller
          control={control}
          name="name"
          render={({field: {onChange, value}}) => (
            <Input
              defaultValue={value}
              onChange={onChange}
              label={t('spaceAdmin.subSpaces.addSubSpaceDialog.name.label')}
              placeholder={t('spaceAdmin.subSpaces.addSubSpaceDialog.name.placeholder')}
              errorMessage={t('spaceAdmin.subSpaces.addSubSpaceDialog.name.errors.required')}
              isError={!!errors.name}
            />
          )}
          rules={{
            required: true
          }}
        />
        <Controller
          control={control}
          name="type"
          render={({field: {onChange, value}}) => (
            <>
              <Dropdown
                placeholder={t('spaceAdmin.subSpaces.addSubSpaceDialog.dropdown.placeholder')}
                value={value ?? ''}
                variant="secondary"
                options={allowedSubSpaceTypes.map((type) => ({
                  label: type.toUpperCase(),
                  value: type
                }))}
                onOptionSelect={(option) => {
                  onChange(option.value);
                }}
              />
              {errors.type && (
                <styled.ErrorMessage>
                  {t('spaceAdmin.subSpaces.addSubSpaceDialog.dropdown.errors.required')}
                </styled.ErrorMessage>
              )}
            </>
          )}
          rules={{required: true}}
        />
      </styled.Body>
    </Dialog>
  );
};

export default observer(AddSubSpaceDialog);
