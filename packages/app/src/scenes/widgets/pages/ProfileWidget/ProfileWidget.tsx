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
  const {sessionStore, agoraStore, widgetStore, widgetManagerStore, nftStore} = useStore();
  const {profileStore} = widgetStore;

  const [activeMenuId, setActiveMenuId] = useState<MenuItemType>('viewProfile');

  const navigate = useNavigate();
  const {t} = useI18n();

  useEffect(() => {
    // TODO: Load nft list
    profileStore.init();
    return () => {
      profileStore.resetModel();
    };
  }, [profileStore]);

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
                  // FIXME: profileStore.nftList
                  nftList={nftStore.nftItems.slice(0, 5)}
                  onVisitNft={onVisitWorld}
                  onInfoNft={onInfoWorld}
                />
              )}

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

              {activeMenuId === 'wallet' && <ManageWallet user={sessionStore.user} />}
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
