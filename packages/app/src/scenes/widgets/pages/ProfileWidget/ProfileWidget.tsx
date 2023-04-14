import {FC, useCallback, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {Panel, SideMenu, SideMenuItemInterface} from '@momentum-xyz/ui-kit-storybook';
import {useI18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';
import {TOAST_GROUND_OPTIONS, ToastContent} from 'ui-kit';
import {ProfileFormInterface} from 'core/interfaces';

import {ProfileSettings, ProfileView, ProfileEditor} from './components';
import * as styled from './ProfileWidget.styled';

type MenuItemType = 'viewProfile' | 'editProfile' | 'settings' | 'wallet' | 'logout';

const ProfileWidget: FC = () => {
  const {sessionStore, agoraStore, universeStore, widgetStore, widgetManagerStore} = useStore();
  const {world3dStore} = universeStore;
  const {profileStore} = widgetStore;

  const [activeMenuId, setActiveMenuId] = useState<MenuItemType>('viewProfile');

  const {t} = useI18n();

  const handleProfileUpdate = useCallback(
    async (form: ProfileFormInterface, previousHash?: string) => {
      const {jobId, isDone} = await profileStore.editProfile(form, previousHash);
      if (isDone && !jobId) {
        await sessionStore.loadUserProfile();
        setActiveMenuId('viewProfile');

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
        setActiveMenuId('viewProfile');

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

  const sideMenuItems: SideMenuItemInterface<MenuItemType>[] = [
    // TODO: Add translations
    {
      id: 'editProfile',
      iconName: 'edit',
      label: 'Edit profile'
    },
    {
      id: 'settings',
      iconName: 'settings',
      label: 'Settings'
    },
    {
      id: 'wallet',
      iconName: 'wallet',
      label: 'Manage wallet'
    },
    {
      id: 'logout',
      iconName: 'leave-left',
      label: 'Log out'
    }
  ];

  return (
    <styled.Container data-testid="ProfileWidget-test">
      <styled.PanelContainer>
        <Panel
          isFullHeight
          size="normal"
          title={t('titles.profile')}
          variant="primary"
          icon="astronaut"
          onClose={() => {
            profileStore.resetModel();
            widgetManagerStore.close(WidgetEnum.PROFILE);
          }}
        >
          {!!sessionStore.user && (
            <styled.Wrapper>
              {activeMenuId === 'viewProfile' && <ProfileView user={sessionStore.user} />}

              {activeMenuId === 'editProfile' && (
                <ProfileEditor
                  user={sessionStore.user}
                  formErrors={profileStore.formErrors}
                  isUpdating={profileStore.isUpdating || sessionStore.isUpdatingInBlockchain}
                  onChangeKeyboardControl={world3dStore?.changeKeyboardControl}
                  onUpdate={handleProfileUpdate}
                  onCancel={() => setActiveMenuId('viewProfile')}
                />
              )}

              {activeMenuId === 'settings' && (
                <ProfileSettings
                  inputAudioDeviceId={agoraStore.userDevicesStore.currentAudioInput?.deviceId}
                  outputAudioDeviceId={agoraStore.userDevicesStore.currentAudioInput?.deviceId} // TODO: Connect;
                  inputMuted={false} // TODO: Connect;
                  outputMuted={false} // TODO: Connect;
                  audioDeviceList={agoraStore.userDevicesStore.audioInputOptions}
                  onSubmit={console.log} // TODO: Connect;
                  onCancel={() => setActiveMenuId('viewProfile')}
                  isUpdating={false}
                />
              )}
            </styled.Wrapper>
          )}
        </Panel>
      </styled.PanelContainer>

      <styled.SideMenuContainer>
        <SideMenu
          activeId={activeMenuId}
          sideMenuItems={sideMenuItems}
          onSelect={(menuId) => {
            if (menuId === 'logout') {
              sessionStore.signOutRedirect();
            } else {
              setActiveMenuId(activeMenuId === menuId ? 'viewProfile' : menuId);
            }
          }}
        />
      </styled.SideMenuContainer>
    </styled.Container>
  );
};

export default observer(ProfileWidget);
