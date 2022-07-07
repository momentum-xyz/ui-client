import React, {useEffect} from 'react';
import {toast} from 'react-toastify';
import {useForm, Controller, SubmitHandler} from 'react-hook-form';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';

import {UpdateUserRequest} from 'api';
import {useStore} from 'shared/hooks';
import {
  Avatar,
  Button,
  Heading,
  Input,
  PanelLayout,
  Portal,
  Text,
  TextArea,
  ToastContent
} from 'ui-kit';
import {UnityService} from 'shared/services';
import {ChangeAvatarPopup} from 'modules/profile/popups/ChangeAvatarPopup';
import {appVariables} from 'api/constants';

import * as styled from './ProfileEditWidget.styled';

interface ProfileEditWidgetPropsInterface {
  userId: string;
  onClose: () => void;
}

const ProfileEditWidget: React.FC<ProfileEditWidgetPropsInterface> = ({onClose, userId}) => {
  const {
    widgetStore,
    sessionStore,
    defaultStore: {homeStore},
    mainStore: {worldStore}
  } = useStore();
  const {profileStore} = widgetStore;
  const {onlineUsersStore} = homeStore;
  const {userProfile, editAvatarDialog} = profileStore;
  const {
    control,
    setValue,
    handleSubmit,
    formState: {errors, isDirty}
  } = useForm<UpdateUserRequest>();

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
    };
  }, []);

  useEffect(() => {
    profileStore.fetchProfile(userId);

    return () => {
      profileStore.resetModel();
    };
  }, [profileStore, userId]);

  const formSubmitHandler: SubmitHandler<UpdateUserRequest> = ({profile, name}) => {
    profileStore.editProfile(name, profile).then((isSuccess) => {
      onClose();
      if (isSuccess) {
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

  const handleAvatarSave = () => {
    if (!profileStore.userProfile?.uuid) {
      return;
    }

    profileStore.fetchProfile(profileStore.userProfile.uuid);
    sessionStore.loadUserProfile();
    onlineUsersStore.fetchUsers(worldStore.worldId);
    editAvatarDialog.close();
  };

  return (
    <>
      {/* TODO: To refactor in the future into a Dialog */}
      {editAvatarDialog.isOpen && (
        <Portal>
          <div style={{zIndex: 100}}>
            <div onClick={editAvatarDialog.close} className="fixed inset-0 bg-dark-blue-70" />
            <ChangeAvatarPopup onClose={editAvatarDialog.close} onSave={handleAvatarSave} />
          </div>
        </Portal>
      )}
      <PanelLayout onClose={onClose} title={t('editProfileWidget.title')} captureAllPointerEvents>
        <styled.Container>
          <styled.AvatarSettings>
            <styled.AvatarContainer>
              <Avatar
                avatarSrc={
                  userProfile?.profile?.avatarHash &&
                  `${appVariables.RENDER_SERVICE_URL}/get/${userProfile.profile.avatarHash}`
                }
                onClick={editAvatarDialog.open}
                size="large"
              />
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
            disabled={!isDirty}
            wide
          />
        </styled.Container>
      </PanelLayout>
    </>
  );
};

export default observer(ProfileEditWidget);
