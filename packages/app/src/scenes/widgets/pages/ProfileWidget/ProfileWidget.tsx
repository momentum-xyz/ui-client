import {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Panel, PositionEnum, SideMenu, SideMenuItemInterface} from '@momentum-xyz/ui-kit';

import {useNavigation, useStore} from 'shared/hooks';
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

  const {t} = useI18n();
  const {goToOdysseyHome} = useNavigation();

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

  const onVisitWorld = (worldId: string) => {
    goToOdysseyHome(worldId);
  };

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
                  wallet={nftStore.selectedWallet}
                  worldsOwnedList={sessionStore.worldsOwnedList}
                  worldsStakedList={sessionStore.worldsStakedList}
                  onVisitWorld={onVisitWorld}
                  onInfoWorld={onInfoWorld}
                />
              )}

              {activeMenuId === 'editProfile' && (
                <ProfileEditor
                  user={sessionStore.user}
                  wallet={nftStore.selectedWallet}
                  formErrors={profileStore.formErrors}
                  isUpdating={profileStore.isUpdating}
                  onUpdate={handleProfileUpdate}
                  onCancel={() => setActiveMenuId('viewProfile')}
                />
              )}

              {activeMenuId === 'settings' && (
                <ProfileSettings
                  inputAudioDeviceId={userDevicesStore.currentAudioInput?.deviceId}
                  outputAudioDeviceId={userDevicesStore.currentAudioOutput?.deviceId}
                  inputAudioDeviceList={userDevicesStore.audioInputOptions}
                  outputAudioDeviceList={userDevicesStore.audioOutputOptions}
                  onCancel={() => setActiveMenuId('viewProfile')}
                  onChangeAudioDevices={(inputId, outputId) => {
                    agoraStore.selectAudioInput(inputId || '');
                    agoraStore.selectAudioOutput(outputId || '');
                    setActiveMenuId('viewProfile');
                  }}
                />
              )}

              {activeMenuId === 'wallet' && (
                <ManageWallet
                  wallets={nftStore.wallets}
                  defaultWalletId={nftStore.defaultWalletId}
                  onChangeDefaultWallet={nftStore.setDefaultWalletId}
                  onRemoveWallet={async (wallet: string) => {
                    await profileStore.removeWallet(wallet);
                    await nftStore.loadMyWallets();
                  }}
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
