import {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath, useNavigate} from 'react-router-dom';
import {useI18n} from '@momentum-xyz/core';
import {Panel, PositionEnum, SideMenu, SideMenuItemInterface} from '@momentum-xyz/ui-kit-storybook';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';
import {ProfileFormInterface} from 'core/interfaces';

import {ProfileSettings, ProfileView, ProfileEditor, ManageWallet} from './components';
import * as styled from './ProfileWidget.styled';

type MenuItemType = 'viewProfile' | 'editProfile' | 'settings' | 'wallet' | 'logout';

const ProfileWidget: FC = () => {
  const {nftStore, sessionStore, agoraStore, widgetStore, widgetManagerStore} = useStore();
  const {userDevicesStore} = agoraStore;
  const {profileStore} = widgetStore;

  const [activeMenuId, setActiveMenuId] = useState<MenuItemType>('viewProfile');

  const navigate = useNavigate();
  const {t} = useI18n();

  useEffect(() => {
    return () => {
      profileStore.resetModel();
    };
  }, [profileStore, sessionStore.userId]);

  const sideMenuItems: SideMenuItemInterface<MenuItemType>[] = useMemo(
    () => [
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
    ],
    [t]
  );

  const panelIcon = useMemo(() => {
    if (activeMenuId !== 'viewProfile') {
      return sideMenuItems.find((i) => i.id === activeMenuId)?.iconName;
    }
    return undefined;
  }, [activeMenuId, sideMenuItems]);

  const panelTitle = useMemo(() => {
    return sideMenuItems.find((i) => i.id === activeMenuId)?.label || t('titles.myProfile');
  }, [activeMenuId, sideMenuItems, t]);

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

  const onInfoWorld = useCallback(
    (id: string) => {
      widgetManagerStore.open(WidgetEnum.WORLD_DETAILS, PositionEnum.LEFT, {id});
    },
    [widgetManagerStore]
  );

  const onVisitWorld = useCallback(
    (worldId: string) => {
      navigate(generatePath(ROUTES.odyssey.base, {worldId}));
    },
    [navigate]
  );

  return (
    <styled.Container data-testid="ProfileWidget-test">
      <styled.PanelContainer>
        <Panel
          isFullHeight
          size="normal"
          variant="primary"
          title={panelTitle}
          icon={panelIcon}
          image={!panelIcon ? sessionStore.userImageUrl : null}
          onClose={() => {
            profileStore.resetModel();
            widgetManagerStore.close(WidgetEnum.MY_PROFILE);
          }}
        >
          {!!sessionStore.user && (
            <styled.Wrapper>
              {activeMenuId === 'viewProfile' && (
                <ProfileView
                  user={sessionStore.user}
                  defaultWalletId={nftStore.defaultWalletId}
                  worldList={sessionStore.worldList}
                  onVisitWorld={onVisitWorld}
                  onInfoWorld={onInfoWorld}
                />
              )}

              {activeMenuId === 'editProfile' && (
                <ProfileEditor
                  user={sessionStore.user}
                  defaultWalletId={nftStore.defaultWalletId}
                  formErrors={profileStore.formErrors}
                  isUpdating={profileStore.isUpdating || sessionStore.isUpdatingInBlockchain}
                  onUpdate={handleProfileUpdate}
                  onCancel={() => setActiveMenuId('viewProfile')}
                />
              )}

              {activeMenuId === 'settings' && (
                <ProfileSettings
                  inputAudioDeviceId={userDevicesStore.currentAudioInput?.deviceId}
                  outputAudioDeviceId={userDevicesStore.currentAudioInput?.deviceId} // TODO: Connect;
                  inputAudioDeviceList={userDevicesStore.audioInputOptions}
                  outputAudioDeviceList={userDevicesStore.audioOutputOptions}
                  onChangeAudioDevices={(inputId, outputId) => {
                    userDevicesStore.selectAudioInput(inputId || '');
                    // userDevicesStore.selectAudioInput(inputId || ''); // TODO: Connect;
                  }}
                  onCancel={() => setActiveMenuId('viewProfile')}
                  isUpdating={false}
                />
              )}

              {activeMenuId === 'wallet' && (
                <ManageWallet
                  wallets={nftStore.wallets}
                  defaultWalletId={nftStore.defaultWalletId}
                  onChangeDefaultWallet={nftStore.setDefaultWalletId}
                  onReloadWallets={nftStore.loadMyWallets}
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
