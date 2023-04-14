/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {FC, useCallback, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {Panel, SideMenu} from '@momentum-xyz/ui-kit-storybook';
import {useI18n} from '@momentum-xyz/core';

import {TOAST_GROUND_OPTIONS, ToastContent} from 'ui-kit';
import {ProfileFormInterface} from 'core/interfaces';
import {useStore} from 'shared/hooks';

import {ProfileSettings, ProfileView, ProfileEditor} from './components';
import * as styled from './ProfileWidget.styled';

const ProfileWidget: FC = () => {
  const {sessionStore, agoraStore, universeStore, widgetStore} = useStore();
  const {world3dStore} = universeStore;
  const {profileStore} = widgetStore;

  const [isDeviceSettings, setIsDeviceSettings] = useState<boolean>(false);

  const [activeMenuIdx, setActiveMenuIdx] = useState<number>(-1);

  const isProfileView = activeMenuIdx === -1;
  const isEditMode = activeMenuIdx === 0;
  const isSettingsView = activeMenuIdx === 1;

  const {t} = useI18n();

  const handleProfileUpdate = useCallback(
    async (form: ProfileFormInterface, previousHash?: string) => {
      const {jobId, isDone} = await profileStore.editProfile(form, previousHash);
      if (isDone && !jobId) {
        await sessionStore.loadUserProfile();
        setActiveMenuIdx(-1);

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
        setActiveMenuIdx(-1);

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
      iconName: 'wallet',
      label: 'Manage wallet'
    },
    ...(!sessionStore.isGuest
      ? [
          {
            iconName: 'leave-left',
            label: 'Log out'
          }
        ]
      : [])
  ];
  const onMenuItemSelection = (menuItemIdx: number) => {
    console.log('onMenuItemSelection', menuItemIdx);
    if (menuItemIdx === 3 && !sessionStore.isGuest) {
      sessionStore.signOutRedirect();
      return;
    }
    setActiveMenuIdx(activeMenuIdx === menuItemIdx ? -1 : menuItemIdx);
  };

  return (
    <styled.Container data-testid="ProfileWidget-test">
      <styled.PanelContainer>
        <Panel
          title={t('titles.profile')}
          variant="primary"
          icon="astronaut"
          onClose={profileStore.resetModel}
        >
          {!!sessionStore.user && (
            <styled.Wrapper>
              {isProfileView && <ProfileView user={sessionStore.user} />}

              {isEditMode && (
                <ProfileEditor
                  user={sessionStore.user}
                  formErrors={profileStore.formErrors}
                  isUpdating={profileStore.isUpdating || sessionStore.isUpdatingInBlockchain}
                  onChangeKeyboardControl={world3dStore?.changeKeyboardControl}
                  onUpdate={handleProfileUpdate}
                  onCancel={() => setActiveMenuIdx(-1)}
                />
              )}

              {isSettingsView && (
                <ProfileSettings
                  inputAudioDeviceId={agoraStore.userDevicesStore.currentAudioInput?.deviceId}
                  outputAudioDeviceId={agoraStore.userDevicesStore.currentAudioInput?.deviceId} // TODO: Connect;
                  inputMuted={false} // TODO: Connect;
                  outputMuted={false} // TODO: Connect;
                  audioDeviceList={agoraStore.userDevicesStore.audioInputOptions}
                  onSubmit={console.log} // TODO: Connect;
                  onCancel={() => setActiveMenuIdx(-1)}
                  isUpdating={false}
                />
              )}
            </styled.Wrapper>
          )}
        </Panel>
      </styled.PanelContainer>
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
