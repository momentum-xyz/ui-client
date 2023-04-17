import {FC, useCallback, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Panel, SideMenu, SideMenuItemInterface} from '@momentum-xyz/ui-kit-storybook';

import {useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';
import {ProfileFormInterface} from 'core/interfaces';

import {ProfileSettings, ProfileView, ProfileEditor} from './components';
import * as styled from './ProfileWidget.styled';

type MenuItemType = 'viewProfile' | 'editProfile' | 'settings' | 'wallet' | 'logout';

const ProfileWidget: FC = () => {
  const {sessionStore, agoraStore, widgetStore, widgetManagerStore} = useStore();
  const {profileStore} = widgetStore;

  const [activeMenuId, setActiveMenuId] = useState<MenuItemType>('viewProfile');

  const {t} = useI18n();

  const handleProfileUpdate = useCallback(
    async (form: ProfileFormInterface, previousHash?: string) => {
      const {isDone} = await profileStore.editProfile(form, previousHash);
      if (isDone) {
        await sessionStore.loadUserProfile();
        setActiveMenuId('viewProfile');
      }
    },
    [profileStore, sessionStore]
  );

  const sideMenuItems: SideMenuItemInterface<MenuItemType>[] = [
    {
      id: 'editProfile',
      iconName: 'edit',
      label: t('actions.editProfile')
    },
    {
      id: 'settings',
      iconName: 'settings',
      label: t('actions.settings')
    },
    {
      id: 'wallet',
      iconName: 'wallet',
      label: t('actions.manageWallet')
    },
    {
      id: 'logout',
      iconName: 'leave-left',
      label: t('actions.logOut')
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
