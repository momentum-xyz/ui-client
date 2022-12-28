import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath, useHistory} from 'react-router-dom';
import {Dialog, Heading, IconSvg, Loader, SvgButton} from '@momentum-xyz/ui-kit';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';

import {ProfileSettings, ProfileView, ProfileEditor} from './components';
import * as styled from './ProfileWidget.styled';

const MENU_OFFSET_LEFT = 10;
const MENU_OFFSET_TOP = 20;

const ProfileWidget: FC = (props) => {
  const {widgetsStore, sessionStore, mainStore, authStore} = useStore();
  const {unityStore, agoraStore, worldStore} = mainStore;
  const {isUnityAvailable} = unityStore;
  const {profileStore} = widgetsStore;

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isDeviceSettings, setIsDeviceSettings] = useState<boolean>(false);

  const history = useHistory();

  useEffect(() => {
    profileStore.fetchProfile();

    return () => {
      sessionStore.loadUserProfile();
      profileStore.resetModel();
    };
  }, [profileStore, sessionStore]);

  const handleTeleportToOdyssey = useCallback(() => {
    const worldId = profileStore.userProfile?.id || '';
    profileStore.profileDialog.close();

    if (isUnityAvailable) {
      console.log(`Teleport in unity to ${worldId}`);
      history.replace(generatePath(ROUTES.odyssey.base, {worldId}));
      unityStore.loadWorldById(worldId, authStore.token);
    } else {
      console.log(`Redirect to unity to ${worldId}`);
      history.replace(generatePath(ROUTES.odyssey.base, {worldId}));
    }
  }, [profileStore, isUnityAvailable, history, unityStore, authStore]);

  const isTeleportAvailable = useMemo(() => {
    return isUnityAvailable
      ? !sessionStore.isGuest && worldStore.worldId !== profileStore.userProfile?.id
      : !sessionStore.isGuest;
  }, [isUnityAvailable, profileStore.userProfile?.id, sessionStore.isGuest, worldStore.worldId]);

  const handleProfileClose = useCallback(() => {
    profileStore.resetModel();
    profileStore.profileDialog.close();
  }, [profileStore]);

  const handleLogout = useCallback(() => {
    document.location = ROUTES.signIn;
  }, []);

  return (
    <Dialog
      title=""
      position="leftTop"
      offset={{left: MENU_OFFSET_LEFT, top: MENU_OFFSET_TOP}}
      isBodyExtendingToEdges
      showBackground={false}
    >
      <div data-testid="ProfileWidget-test">
        <styled.Header>
          <styled.Name>
            <IconSvg name="people" size="medium" />
            <Heading type="h2" label="Profile" isTruncate />
          </styled.Name>
          <SvgButton iconName="close" size="normal" onClick={handleProfileClose} />
        </styled.Header>
        <styled.Body>
          {!isEditMode && profileStore.isLoading && (
            <styled.Loader>
              <Loader />
            </styled.Loader>
          )}

          {!!profileStore.userProfile && (
            <styled.Container>
              {!isEditMode && !profileStore.isLoading && (
                <ProfileView
                  isVisitAvailable={isTeleportAvailable}
                  user={profileStore.userProfile}
                  onTeleportToOdyssey={handleTeleportToOdyssey}
                />
              )}

              {isEditMode && (
                <ProfileEditor
                  user={profileStore.userProfile}
                  formErrors={profileStore.formErrors}
                  onChangeKeyboardControl={unityStore.changeKeyboardControl}
                  onEditProfile={profileStore.editProfile}
                  onEditImage={profileStore.editImage}
                />
              )}

              <ProfileSettings
                isEditMode={isEditMode}
                isDeviceSettings={isDeviceSettings}
                audioDeviceId={agoraStore.userDevicesStore.currentAudioInput?.deviceId}
                audioDeviceList={agoraStore.userDevicesStore.audioInputOptions}
                onSelectAudioDevice={agoraStore.selectAudioInput}
                onToggleDeviceSettings={() => {
                  setIsDeviceSettings(!isDeviceSettings);
                }}
                onToggleEditMode={() => {
                  if (isEditMode) {
                    profileStore.fetchProfile();
                    sessionStore.loadUserProfile();
                  }
                  setIsEditMode(!isEditMode);
                }}
                onLogout={handleLogout}
              />
            </styled.Container>
          )}
        </styled.Body>
      </div>
    </Dialog>
  );
};

export default observer(ProfileWidget);
