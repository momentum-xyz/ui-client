/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {FC, useCallback, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {Panel, SideMenu} from '@momentum-xyz/ui-kit-storybook';
import {useI18n} from '@momentum-xyz/core';

import {ProfileStore} from 'scenes/widgets/stores';
import {TOAST_GROUND_OPTIONS, ToastContent} from 'ui-kit';
import {ProfileFormInterface} from 'core/interfaces';
import {useStore} from 'shared/hooks';

import {ProfileSettings, ProfileView, ProfileEditor} from './components';
import * as styled from './ProfileWidget.styled';

const ProfileWidget: FC = () => {
  const profileStore = ProfileStore.create();
  const {sessionStore, agoraStore, universeStore} = useStore();
  const {world3dStore} = universeStore;

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isDeviceSettings, setIsDeviceSettings] = useState<boolean>(false);

  const {t} = useI18n();

  const handleProfileUpdate = useCallback(
    async (form: ProfileFormInterface, previousHash?: string) => {
      const {jobId, isDone} = await profileStore.editProfile(form, previousHash);
      if (isDone && !jobId) {
        await sessionStore.loadUserProfile();
        setIsEditMode(false);

        toast.info(
          <ToastContent
            headerIconName="people"
            title={t('titles.alert')}
            text={t('editProfileWidget.saveSuccess')}
            showCloseButton
          />,
          TOAST_GROUND_OPTIONS
        );
      }

      if (isDone && jobId) {
        sessionStore.setupJobId(jobId);
        setIsEditMode(false);

        toast.info(
          <ToastContent
            headerIconName="people"
            title={t('titles.alert')}
            text={t('editProfileWidget.saveInProgress')}
            showCloseButton
          />,
          TOAST_GROUND_OPTIONS
        );
      }

      if (!isDone) {
        toast.error(
          <ToastContent
            isDanger
            headerIconName="people"
            title={t('titles.alert')}
            text={t('editProfileWidget.saveFailure')}
            showCloseButton
          />
        );
      }
    },
    [profileStore, sessionStore, t]
  );

  console.log(sessionStore.user);

  const sideMenuItems: any[] = [
    // TODO: Add proper export of interface and remove `any[]`
    // TODO: Add translations
    {
      iconName: 'edit',
      label: 'Edit profile'
    },
    {
      iconName: 'settings',
      label: 'Settings'
    },
    {
      iconName: 'buy', // TODO: Add proper icon
      label: 'Buy odyssey'
    },
    {
      iconName: 'leave-left',
      label: 'Log out'
    }
  ];
  const activeMenuIdx = isEditMode ? 1 : 0;
  const onMenuItemSelection = (menuItemIdx: number) => {
    console.log('onMenuItemSelection', menuItemIdx);
  };

  return (
    <styled.Container data-testid="ProfileWidget-test">
      <Panel
        title={t('titles.profile')}
        variant="primary"
        icon="astronaut"
        onClose={profileStore.resetModel}
      >
        {!!sessionStore.user && (
          <styled.Wrapper>
            {!isEditMode && <ProfileView user={sessionStore.user} />}

            {/* {isEditMode && (
              <ProfileEditor
                user={sessionStore.user}
                formErrors={profileStore.formErrors}
                isUpdating={profileStore.isUpdating || sessionStore.isUpdatingInBlockchain}
                onChangeKeyboardControl={world3dStore?.changeKeyboardControl}
                onUpdate={handleProfileUpdate}
                onCancel={() => setIsEditMode(!isEditMode)}
              />
            )}

            <ProfileSettings
              isGuest={sessionStore.isGuest}
              isEditMode={isEditMode}
              isDeviceSettings={isDeviceSettings}
              audioDeviceId={agoraStore.userDevicesStore.currentAudioInput?.deviceId}
              audioDeviceList={agoraStore.userDevicesStore.audioInputOptions}
              onSelectAudioDevice={agoraStore.selectAudioInput}
              onToggleDeviceSettings={() => setIsDeviceSettings(!isDeviceSettings)}
              onToggleEditMode={() => setIsEditMode(!isEditMode)}
              {...(!sessionStore.isGuest && {onSignOut: sessionStore.signOutRedirect})}
              {...(sessionStore.isGuest && {onSignIn: sessionStore.signInRedirect})}
            /> */}
          </styled.Wrapper>
        )}
      </Panel>

      <styled.SideMenuContainer>
        <SideMenu
          sideMenuItems={sideMenuItems}
          activeIdx={activeMenuIdx}
          onMenuItemSelection={onMenuItemSelection}
        />
      </styled.SideMenuContainer>
    </styled.Container>
  );
};

export default observer(ProfileWidget);
