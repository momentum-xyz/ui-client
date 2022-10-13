import React, {FC, useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useTheme} from 'styled-components';
import {useTranslation} from 'react-i18next';
import {
  Button,
  FileUploader,
  IconSvg,
  InputDark,
  Text,
  TextAreaDark,
  TextInterface
} from '@momentum-xyz/ui-kit';

import {appVariables} from 'api/constants';
import {FieldErrorInterface} from 'api/interfaces';
import {SignUpFormInterface} from 'scenes/profile/stores/SignUpCompleteStore';

import * as styled from './SignUpCompleteForm.styled';

const TEXT_PROPS: TextInterface = {
  size: 'xxs',
  align: 'left',
  weight: 'bold',
  transform: 'uppercase'
};

interface PropsInterface {
  user: SignUpFormInterface;
  fieldErrors: FieldErrorInterface[];
  isSubmitDisabled?: boolean;
  onSubmit: (form: SignUpFormInterface) => void;
  onCancel: () => void;
}

const SignUpCompleteForm: FC<PropsInterface> = (props) => {
  const {user, fieldErrors, isSubmitDisabled, onSubmit, onCancel} = props;

  const {t} = useTranslation();
  const theme = useTheme();

  const {
    control,
    setError,
    handleSubmit,
    formState: {errors}
  } = useForm<SignUpFormInterface>({
    defaultValues: {...user}
  });

  const onUpdateProfile = handleSubmit((data: SignUpFormInterface) => {
    onSubmit(data);
  });

  useEffect(() => {
    fieldErrors.forEach(({fieldName, errorMessage}) => {
      setError(fieldName as keyof SignUpFormInterface, {type: 'duplicate', message: errorMessage});
    });
  }, [fieldErrors, setError]);

  return (
    <div data-testid="SignUpCompleteForm-test">
      {/* Avatar field */}
      <styled.Wrapper>
        <Controller
          name="avatar"
          control={control}
          render={({field: {value, onChange}}) => (
            <styled.AvatarImageUpload>
              {value && <styled.ImagePreview src={URL.createObjectURL(value)} />}
              {!value && !!user.avatarHash && (
                <styled.ImagePreview
                  src={`${appVariables.RENDER_SERVICE_URL}/get/${user.avatarHash}`}
                />
              )}
              <FileUploader
                theme={theme}
                fileType="image"
                label={value ? t('fileUploader.changeLabel') : t('fileUploader.uploadLabel')}
                dragActiveLabel={t('fileUploader.dragActiveLabel')}
                onFilesUpload={onChange}
              />
            </styled.AvatarImageUpload>
          )}
        />
      </styled.Wrapper>
      <styled.FieldName>
        <IconSvg name="profile" size="medium" theme={theme} />
        <Text theme={theme} {...TEXT_PROPS} text={t('actions.chooseAvatar')} />
      </styled.FieldName>

      <styled.Divider />

      {/* Nickname field */}
      <styled.Field>
        <styled.FieldName>
          <IconSvg name="profile" size="medium" theme={theme} />
          <Text theme={theme} {...TEXT_PROPS} text={`${t('fields.nickname')} *`} />
        </styled.FieldName>
        <Controller
          name="name"
          control={control}
          rules={{required: true, maxLength: 32, minLength: 2}}
          render={({field: {onChange, value}}) => (
            <InputDark
              theme={theme}
              value={value || ''}
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
      </styled.Field>

      {/* Social field */}
      <styled.Field>
        <styled.FieldName>
          <IconSvg name="link" size="medium" theme={theme} />
          <Text theme={theme} {...TEXT_PROPS} text={t('fields.social')} />
        </styled.FieldName>
        <Controller
          name="profileLink"
          control={control}
          render={({field: {onChange, value}}) => (
            <InputDark value={value || ''} theme={theme} onChange={onChange} />
          )}
        />
      </styled.Field>

      {/* Bio field */}
      <styled.Field>
        <styled.FieldName>
          <IconSvg name="profile" size="medium" theme={theme} />
          <Text theme={theme} {...TEXT_PROPS} text={t('fields.bio')} />
        </styled.FieldName>
        <Controller
          name="bio"
          control={control}
          render={({field: {onChange, value}}) => (
            <TextAreaDark value={value || ''} theme={theme} onChange={onChange} />
          )}
        />
      </styled.Field>

      <styled.Actions>
        <Button
          wide
          theme={theme}
          label={t('actions.cancel')}
          variant="danger"
          onClick={onCancel}
        />
        <Button
          wide
          theme={theme}
          label={t('actions.saveProfile')}
          disabled={isSubmitDisabled}
          onClick={onUpdateProfile}
        />
      </styled.Actions>
    </div>
  );
};

export default SignUpCompleteForm;
