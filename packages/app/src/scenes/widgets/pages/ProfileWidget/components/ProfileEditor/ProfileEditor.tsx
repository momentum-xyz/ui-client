import React, {useEffect} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {observer} from 'mobx-react-lite';
import {Button, FileUploader, InputDark, Text, TextAreaDark} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {ProfileFormInterface} from 'core/interfaces';
import {UserModelInterface} from 'core/models';
import {FieldErrorInterface} from 'api/interfaces';

import * as styled from './ProfileEditor.styled';

interface PropsInterface {
  user: UserModelInterface;
  formErrors: FieldErrorInterface[];
  isUpdating: boolean;
  onChangeKeyboardControl: (value: boolean) => void;
  onUpdate: (form: ProfileFormInterface, previousImageHash?: string) => void;
  onCancel: () => void;
}

const ProfileEditor: React.FC<PropsInterface> = (props) => {
  const {user, formErrors, isUpdating, onUpdate, onCancel, onChangeKeyboardControl} = props;

  const {t} = useI18n();

  useEffect(() => {
    onChangeKeyboardControl(false);
    return () => {
      onChangeKeyboardControl(true);
    };
  }, [onChangeKeyboardControl]);

  const {
    control,
    setValue,
    handleSubmit,
    setError,
    formState: {errors}
  } = useForm<ProfileFormInterface>();

  useEffect(() => {
    formErrors.forEach(({fieldName, errorMessage}) => {
      setError(fieldName as keyof ProfileFormInterface, {
        type: 'duplicate',
        message: errorMessage
      });
    });
  }, [formErrors, setError]);

  useEffect(() => {
    if (user?.profile) {
      setValue('name', user.name);
      setValue('bio', user.profile.bio);
      setValue('profileLink', user.profile.profileLink);
    }
  }, [user?.name, user?.profile, setValue]);

  const formSubmitHandler = handleSubmit(async (form: ProfileFormInterface) => {
    await onUpdate(form, user.profile.avatarHash);
  });

  return (
    <styled.Container data-testid="ProfileEditor-test">
      {/* AVATAR */}
      <Controller
        name="avatarFile"
        control={control}
        render={({field: {value, onChange}}) => (
          <styled.Avatar>
            <styled.AvatarImageUpload>
              {value && <styled.AvatarImage src={URL.createObjectURL(value)} />}
              {!value && !!user.avatarSrc && <styled.AvatarImage src={user.avatarSrc} />}
              <styled.AvatarImageInner>
                <FileUploader
                  label={t('fileUploader.uploadLabel')}
                  dragActiveLabel={t('fileUploader.dragActiveLabel')}
                  fileType="image"
                  buttonSize="small"
                  onFilesUpload={onChange}
                  onError={(error) => console.error(error)}
                  enableDragAndDrop={false}
                  disabled={isUpdating}
                />
              </styled.AvatarImageInner>
            </styled.AvatarImageUpload>
          </styled.Avatar>
        )}
      />

      {/* NAME */}
      <styled.InputsContainer>
        <Controller
          control={control}
          name="name"
          rules={{required: true, maxLength: 32, minLength: 2}}
          render={({field: {value, onChange}}) => (
            <InputDark
              value={value}
              onChange={onChange}
              placeholder={t('fields.name') || ''}
              errorMessage={
                errors?.name?.type !== 'duplicate'
                  ? t('errors.nameConstraints')
                  : errors.name.message
              }
              isError={!!errors.name}
              disabled={isUpdating}
              required
            />
          )}
        />

        {/* BIO */}
        <Controller
          control={control}
          name="bio"
          render={({field: {value, onChange}}) => (
            <TextAreaDark
              rows={3}
              placeholder={t('fields.bio') || ''}
              value={value}
              disabled={isUpdating}
              onChange={onChange}
            />
          )}
        />

        {/* LINK */}
        <Controller
          control={control}
          name="profileLink"
          render={({field: {value, onChange}}) => (
            <InputDark
              placeholder={t('fields.link') || ''}
              value={value}
              disabled={isUpdating}
              onChange={onChange}
            />
          )}
        />
      </styled.InputsContainer>

      <styled.Actions>
        <Button variant="danger" label={t('actions.cancel')} onClick={onCancel} />
        <Button label={t('actions.save')} disabled={isUpdating} onClick={formSubmitHandler} />
      </styled.Actions>

      {isUpdating && (
        <styled.IsUpdating>
          <Text size="xs" text={t('editProfileWidget.isUpdating')} align="center" />
        </styled.IsUpdating>
      )}
    </styled.Container>
  );
};

export default observer(ProfileEditor);
