import React, {useEffect} from 'react';
import {toast} from 'react-toastify';
import {useForm, Controller, SubmitHandler} from 'react-hook-form';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';
import {Heading, Avatar, Button, Input, Text, TextArea} from '@momentum-xyz/ui-kit';

import {UpdateProfileInterface} from 'api';
import {useStore} from 'shared/hooks';
import {ToastContent} from 'ui-kit';

import * as styled from './MyProfileEditor.styled';
import {MyAvatarForm} from './components';

interface PropsInterface {
  userId: string;
}

const MyProfileEdit: React.FC<PropsInterface> = ({userId}) => {
  const {sessionStore, worldChatStore, homeStore, mainStore} = useStore();
  const {onlineUsersStore, userProfileStore} = homeStore;
  const {onlineUsersList} = onlineUsersStore;
  const {userProfile, editAvatarDialog, formErrors} = userProfileStore;
  const {worldStore, unityStore} = mainStore;
  const {
    control,
    setValue,
    handleSubmit,
    setError,
    clearErrors,
    formState: {errors, isDirty}
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
    if (!userProfile?.profile) {
      return;
    }

    setValue('name', userProfile.name);
    setValue('profile', userProfile.profile);
  }, [userProfile?.name, userProfile?.profile, setValue]);

  useEffect(() => {
    unityStore.changeKeyboardControl(false);

    return () => {
      unityStore.changeKeyboardControl(true);
      userProfileStore.setImage(undefined);
      userProfileStore.resetModel();
    };
  }, [userProfileStore, unityStore]);

  const formSubmitHandler: SubmitHandler<UpdateProfileInterface> = async ({profile, name}) => {
    const response = await userProfileStore.editProfile(name, profile);
    if (response) {
      // no await here! is it needed?
      userProfileStore.fetchProfile(userId).then(() => {
        sessionStore.reload();
        userProfileStore.fetchUserSpaceList(userId);
        onlineUsersList.fetchUsers(worldStore.worldId, userId, true);
        if (userProfileStore.userProfile) {
          worldChatStore.updateUser(userId, userProfileStore.userProfile);
        }
      });
      toast.info(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('editProfileWidget.saveSuccess')}
          showCloseButton
        />
      );
      sessionStore.updateName(name);
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
  };

  return (
    <styled.Container data-testid="MyProfileEdit-test">
      <styled.AvatarSettings>
        <styled.AvatarContainer onClick={editAvatarDialog.open}>
          {userProfileStore.selectedImage ? (
            <styled.ImagePreview src={URL.createObjectURL(userProfileStore.selectedImage)} />
          ) : (
            <Avatar avatarSrc={sessionStore.profile?.avatarSrc} size="large" />
          )}
        </styled.AvatarContainer>
        <div>
          <Heading
            type="h3"
            label={t('editProfileWidget.avatar')}
            weight="bold"
            transform="uppercase"
            align="left"
          />
          <Text text={t('editProfileWidget.avatarInstructions')} size="s" align="left" />
        </div>
      </styled.AvatarSettings>
      <styled.InputsContainer>
        <Controller
          control={control}
          name="name"
          rules={{required: true, maxLength: 32, minLength: 2}}
          render={({field: {value, onChange}}) => (
            <Input
              label={t('fields.name')}
              value={value}
              onChange={onChange}
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
        <Controller
          control={control}
          name="profile.location"
          render={({field: {value, onChange}}) => (
            <Input label={t('fields.location')} value={value} onChange={onChange} />
          )}
        />
        <Controller
          control={control}
          name="profile.profileLink"
          render={({field: {value, onChange}}) => (
            <Input label={t('fields.site')} value={value} onChange={onChange} />
          )}
        />
        <Controller
          control={control}
          name="profile.bio"
          render={({field: {value, onChange}}) => (
            <TextArea name={`${t('fields.bio')}:`} value={value} onChange={onChange} />
          )}
        />
      </styled.InputsContainer>
      <Button
        label={t('actions.saveChanges')}
        onClick={(e) => {
          handleSubmit(formSubmitHandler)(e);
        }}
        disabled={(!isDirty && !userProfileStore.selectedImage) || userProfileStore.isSavingProfile}
        wide
      />

      {userProfileStore.editAvatarDialog.isOpen && <MyAvatarForm />}
    </styled.Container>
  );
};

export default observer(MyProfileEdit);
