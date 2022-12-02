import React, {useEffect} from 'react';
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
import {MyAvatarForm} from './components';

interface PropsInterface {
  user: UserModelInterface;
}

const MyProfileEdit: React.FC<PropsInterface> = (props) => {
  const {user} = props;

  const {homeStore, mainStore} = useStore();
  const {userProfileStore} = homeStore;
  const {formErrors} = userProfileStore;
  const {unityStore} = mainStore;

  useEffect(() => {
    unityStore.changeKeyboardControl(false);

    return () => {
      unityStore.changeKeyboardControl(true);
      userProfileStore.setImage(undefined);
    };
  }, [userProfileStore, unityStore]);

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
    setValue('profile.image', userProfileStore.selectedImage);
  }, [userProfileStore.selectedImage, setValue]);

  useEffect(() => {
    if (user?.profile) {
      setValue('name', user.name);
      setValue('profile', user.profile);
    }
  }, [user?.name, user?.profile, setValue]);

  const formSubmitHandler = handleSubmit(async (data: UpdateProfileInterface) => {
    const response = await userProfileStore.editProfile(data.name, data.profile);
    if (response) {
      // TODO: Reload session
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

  return (
    <styled.Container>
      {/*<styled.AvatarSettings>
        <styled.AvatarContainer onClick={editAvatarDialog.open}>
          {userProfileStore.selectedImage ? (
            <styled.ImagePreview src={URL.createObjectURL(userProfileStore.selectedImage)} />
          ) : (
            <Avatar avatarSrc={sessionStore.user?.avatarSrc} size="large" />
          )}
        </styled.AvatarContainer>
      </styled.AvatarSettings>*/}

      <styled.Avatar>
        <styled.AvatarImageUpload>
          <styled.AvatarImageInner>
            <FileUploader
              label="Upload Image"
              dragActiveLabel="Drop the files here..."
              fileType="image"
              buttonSize="small"
              onFilesUpload={(file) => console.log(file)}
              maxSize={10 * Math.pow(2, 20)}
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

      {userProfileStore.editAvatarDialog.isOpen && <MyAvatarForm />}
    </styled.Container>
  );
};

export default observer(MyProfileEdit);
