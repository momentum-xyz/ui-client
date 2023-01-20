import React, {FC, useEffect} from 'react';
import {Button, FileUploader, Heading, IconSvg, InputDark, Text} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';
import {Controller, useForm} from 'react-hook-form';

import {Box} from 'ui-kit';
import {SignUpFormInterface} from 'core/interfaces';
import {FieldErrorInterface} from 'api/interfaces';

import * as styled from './CreateOdysseyForm.styled';

interface PropsInterface {
  isSubmitDisabled: boolean;
  fieldErrors: FieldErrorInterface[];
  onSubmit: (form: SignUpFormInterface) => void;
}

const CreateOdysseyForm: FC<PropsInterface> = (props) => {
  const {fieldErrors, isSubmitDisabled: disabled, onSubmit} = props;

  const {t} = useTranslation();

  const {
    control,
    setError,
    handleSubmit,
    formState: {errors}
  } = useForm<SignUpFormInterface>();

  const onUpdateProfile = handleSubmit((data: SignUpFormInterface) => {
    onSubmit(data);
  });

  useEffect(() => {
    fieldErrors.forEach(({fieldName, errorMessage}) => {
      setError(fieldName as keyof SignUpFormInterface, {type: 'duplicate', message: errorMessage});
    });
  }, [fieldErrors, setError]);

  return (
    <Box size="small">
      <styled.Div>
        <styled.Header>
          <IconSvg name="add" size="normal" />
          <Heading type="h3" label={t('actions.createOdyssey')} align="left" />
        </styled.Header>

        <Text size="s" text={t('labels.createProfile')} align="left" weight="bold" />
        <Text size="s" text={t('messages.createProfileDesc')} align="left" />

        {/* USERNAME */}
        <Text size="s" text={t('messages.yourName')} align="left" />
        <styled.InputContainer>
          <IconSvg name="profile" size="large" />
          <Controller
            name="name"
            control={control}
            rules={{required: true, maxLength: 32, minLength: 2}}
            render={({field: {onChange, value}}) => (
              <InputDark
                variant="secondary"
                placeholder={t('actions.chooseName')}
                value={value || ''}
                disabled={disabled}
                isError={!!errors.name}
                errorMessage={
                  errors?.name?.type !== 'duplicate'
                    ? t('errors.nameConstraints')
                    : errors.name.message
                }
                onChange={onChange}
              />
            )}
          />
        </styled.InputContainer>

        {/* AVATAR */}
        <Text size="s" text={t('messages.chooseImage')} align="left" />
        <Controller
          name="avatar"
          control={control}
          render={({field: {value, onChange}}) => (
            <styled.Avatar>
              <styled.AvatarImageUpload>
                {value && <styled.ImagePreview src={URL.createObjectURL(value)} />}
                <styled.AvatarImageInner>
                  <FileUploader
                    label={t('fileUploader.uploadLabel')}
                    dragActiveLabel={t('fileUploader.dragActiveLabel')}
                    fileType="image"
                    buttonSize="medium"
                    onFilesUpload={onChange}
                    onError={(error) => console.error(error)}
                    enableDragAndDrop={false}
                  />
                </styled.AvatarImageInner>
              </styled.AvatarImageUpload>
            </styled.Avatar>
          )}
        />

        <Text size="m" text={t('messages.startCounting')} align="left" />

        <Button
          icon="astro"
          size="medium"
          label={t('actions.startJourney')}
          disabled={disabled}
          onClick={onUpdateProfile}
        />
      </styled.Div>
    </Box>
  );
};

export default CreateOdysseyForm;
