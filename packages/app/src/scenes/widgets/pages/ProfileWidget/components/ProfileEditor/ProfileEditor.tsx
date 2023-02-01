import React, {useEffect} from 'react';
import {toast} from 'react-toastify';
import {useForm, Controller} from 'react-hook-form';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {Button, FileUploader, InputDark, TextAreaDark} from '@momentum-xyz/ui-kit';

import {ProfileFormInterface} from 'core/interfaces';
import {UserModelInterface} from 'core/models';
import {FieldErrorInterface} from 'api/interfaces';
import {ToastContent} from 'ui-kit';

import * as styled from './ProfileEditor.styled';

interface PropsInterface {
  user: UserModelInterface;
  formErrors: FieldErrorInterface[];
  isUpdating: boolean;
  onChangeKeyboardControl: (value: boolean) => void;
  onUpdate: (form: ProfileFormInterface, previousImageHash?: string) => Promise<boolean>;
  onCancel: () => void;
}

const ProfileEditor: React.FC<PropsInterface> = (props) => {
  const {user, formErrors, isUpdating, onUpdate, onCancel, onChangeKeyboardControl} = props;

  const {t} = useTranslation();

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
    clearErrors,
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
      setValue('profileLink', user.profile.bio);
    }
  }, [user?.name, user?.profile, setValue]);

  const formSubmitHandler = handleSubmit(async (form: ProfileFormInterface) => {
    if (!(await onUpdate(form, user.profile.avatarHash))) {
      toast.error(
        <ToastContent
          isDanger
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('editProfileWidget.saveFailure')}
          showCloseButton
        />
      );
    } else {
      clearErrors();
    }
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
              placeholder="Name"
              errorMessage={
                errors?.name?.type !== 'duplicate'
                  ? t('errors.nameConstraints')
                  : errors.name.message
              }
              isError={!!errors.name}
              required
            />
          )}
        />

        {/* BIO */}
        <Controller
          control={control}
          name="bio"
          render={({field: {value, onChange}}) => (
            <TextAreaDark placeholder="Bio" value={value} rows={3} onChange={onChange} />
          )}
        />

        {/* LINK */}
        <Controller
          control={control}
          name="profileLink"
          render={({field: {value, onChange}}) => (
            <InputDark placeholder="Link" value={value} onChange={onChange} />
          )}
        />
      </styled.InputsContainer>

      <styled.Actions>
        <Button variant="danger" label={t('actions.cancel')} onClick={onCancel} />
        <Button label={t('actions.save')} disabled={isUpdating} onClick={formSubmitHandler} />
      </styled.Actions>
    </styled.Container>
  );
};

export default observer(ProfileEditor);
