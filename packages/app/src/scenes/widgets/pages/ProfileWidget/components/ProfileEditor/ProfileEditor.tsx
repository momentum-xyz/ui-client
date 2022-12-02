import React, {useCallback, useEffect} from 'react';
import {toast} from 'react-toastify';
import {useForm, Controller} from 'react-hook-form';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';
import {FileUploader, InputDark, TextAreaDark} from '@momentum-xyz/ui-kit';

import {UserModelInterface} from 'core/models';
import {UpdateProfileInterface} from 'api';
import {useStore} from 'shared/hooks';
import {ToastContent} from 'ui-kit';

import * as styled from './ProfileEditor.styled';

interface PropsInterface {
  user: UserModelInterface;
}

const MyProfileEdit: React.FC<PropsInterface> = (props) => {
  const {user} = props;

  const {mainStore, widgetsStore} = useStore();
  const {profileStore} = widgetsStore;
  const {formErrors} = profileStore;
  const {unityStore} = mainStore;

  useEffect(() => {
    unityStore.changeKeyboardControl(false);

    return () => {
      unityStore.changeKeyboardControl(true);
    };
  }, [unityStore]);

  const {
    control,
    setValue,
    handleSubmit,
    setError,
    clearErrors,
    formState: {errors}
  } = useForm<UpdateProfileInterface>();

  useEffect(() => {
    formErrors.forEach(({fieldName, errorMessage}) => {
      setError(fieldName as keyof UpdateProfileInterface, {
        type: 'duplicate',
        message: errorMessage
      });
    });
  }, [formErrors, setError]);

  useEffect(() => {
    if (user?.profile) {
      setValue('name', user.name);
      setValue('profile', user.profile);
    }
  }, [user?.name, user?.profile, setValue]);

  const formSubmitHandler = handleSubmit(async (data: UpdateProfileInterface) => {
    const response = await profileStore.editProfile(data.name, data.profile);
    if (response) {
      // TODO: Removal
      toast.info(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('editProfileWidget.saveSuccess')}
          showCloseButton
        />
      );
      clearErrors();
    } else {
      toast.error(
        <ToastContent
          isDanger
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('editProfileWidget.saveFailure')}
          showCloseButton
        />
      );
    }
  });

  const imageHandle = useCallback(
    async (file: File | undefined) => {
      if (file) {
        await profileStore.editImage(file);
      }
    },
    [profileStore]
  );

  return (
    <styled.Container>
      <styled.Avatar>
        <styled.AvatarImageUpload>
          {!!user.avatarSrc && <styled.AvatarImage src={user.avatarSrc} />}
          <styled.AvatarImageInner>
            <FileUploader
              label="Upload Image"
              dragActiveLabel="Drop the files here..."
              fileType="image"
              buttonSize="small"
              onFilesUpload={imageHandle}
              onError={(error) => console.error(error)}
              enableDragAndDrop={false}
            />
          </styled.AvatarImageInner>
        </styled.AvatarImageUpload>
      </styled.Avatar>

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
              onBlur={formSubmitHandler}
            />
          )}
        />

        {/* BIO */}
        <Controller
          control={control}
          name="profile.bio"
          render={({field: {value, onChange}}) => (
            <TextAreaDark
              placeholder="Bio"
              value={value}
              rows={3}
              onChange={onChange}
              onBlur={formSubmitHandler}
            />
          )}
        />

        {/* LOCATION */}
        <Controller
          control={control}
          name="profile.location"
          render={({field: {value, onChange}}) => (
            <InputDark
              placeholder="Location"
              value={value}
              onChange={onChange}
              onBlur={formSubmitHandler}
            />
          )}
        />

        {/* LINK */}
        <Controller
          control={control}
          name="profile.profileLink"
          render={({field: {value, onChange}}) => (
            <InputDark
              placeholder="Link"
              value={value}
              onChange={onChange}
              onBlur={formSubmitHandler}
            />
          )}
        />
      </styled.InputsContainer>
    </styled.Container>
  );
};

export default observer(MyProfileEdit);
