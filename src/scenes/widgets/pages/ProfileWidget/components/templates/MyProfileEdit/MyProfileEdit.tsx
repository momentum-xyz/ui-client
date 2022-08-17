import React, {useEffect} from 'react';
import {toast} from 'react-toastify';
import {useForm, Controller, SubmitHandler} from 'react-hook-form';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';

import {UpdateUserRequest} from 'api';
import {useStore} from 'shared/hooks';
import {Avatar, Button, Heading, Input, Text, TextArea, ToastContent} from 'ui-kit';
import {UnityService} from 'shared/services';

import * as styled from './MyProfileEdit.styled';

interface PropsInterface {
  userId: string;
  onClose?: () => void;
}

const MyProfileEdit: React.FC<PropsInterface> = ({onClose, userId}) => {
  const {widgetStore, sessionStore, homeStore, mainStore} = useStore();
  const {onlineUsersList} = homeStore;
  const {profileStore} = widgetStore;
  const {userProfile, editAvatarDialog} = profileStore;
  const {worldStore} = mainStore;
  const {
    control,
    setValue,
    handleSubmit,
    formState: {errors, isDirty}
  } = useForm<UpdateUserRequest>();

  useEffect(() => {
    setValue('profile.image', profileStore.selectedImage);
  }, [profileStore.selectedImage]);

  useEffect(() => {
    if (!userProfile?.profile) {
      return;
    }

    setValue('name', userProfile.name);
    setValue('profile', userProfile.profile);
  }, [userProfile?.name, userProfile?.profile, setValue]);

  useEffect(() => {
    UnityService.setKeyboardControl(false);

    return () => {
      UnityService.setKeyboardControl(true);
      profileStore.setImage(undefined);
    };
  }, []);

  const formSubmitHandler: SubmitHandler<UpdateUserRequest> = ({profile, name}) => {
    profileStore.editProfile(name, profile).then((isSuccess) => {
      if (isSuccess) {
        profileStore.fetchProfile(userId).then(() => {
          sessionStore.reload();
          profileStore.fetchUserSpaceList(userId);
          onlineUsersList.fetchUsers(worldStore.worldId);
        });
        toast.info(
          <ToastContent
            headerIconName="alert"
            title={t('titles.alert')}
            text={t('editProfileWidget.saveSuccess')}
            isCloseButton
          />
        );
        sessionStore.updateName(name);
      } else {
        toast.error(
          <ToastContent
            isDanger
            headerIconName="alert"
            title={t('titles.alert')}
            text={t('editProfileWidget.saveFailure')}
            isCloseButton
          />
        );
      }
    });
  };

  return (
    <styled.Container data-testid="MyProfileEdit-test">
      <styled.AvatarSettings>
        <styled.AvatarContainer onClick={editAvatarDialog.open}>
          {profileStore.selectedImage ? (
            <styled.ImagePreview src={URL.createObjectURL(profileStore.selectedImage)} />
          ) : (
            <Avatar avatarSrc={sessionStore.profile?.avatarSrc} size="large" />
          )}
        </styled.AvatarContainer>
        <div>
          <Heading type="h3" label="Avatar" weight="bold" transform="uppercase" align="left" />
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
              errorMessage={t('errors.nameConstraints')}
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
        disabled={
          (!isDirty && !profileStore.selectedImage) ||
          onlineUsersList.isLoading ||
          profileStore.avatarIsLoading
        }
        wide
      />
    </styled.Container>
  );
};

export default observer(MyProfileEdit);
