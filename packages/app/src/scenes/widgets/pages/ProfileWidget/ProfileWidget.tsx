import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath, useNavigate} from 'react-router-dom';
import {Dialog, Heading, IconSvg, Loader, SvgButton} from '@momentum-xyz/ui-kit';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';

import {ProfileSettings, ProfileView, ProfileEditor} from './components';
import * as styled from './ProfileWidget.styled';

const MENU_OFFSET_LEFT = 10;
const MENU_OFFSET_TOP = 20;

const ProfileWidget: FC = () => {
  const {widgetsStore, sessionStore, agoraStore, unityStore} = useStore();
  const {isUnityAvailable, unityInstanceStore} = unityStore;
  const {profileStore} = widgetsStore;

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isDeviceSettings, setIsDeviceSettings] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    profileStore.fetchProfile();

    return () => {
      sessionStore.loadUserProfile();
      profileStore.resetModel();
    };
  }, [profileStore, sessionStore]);

  const handleTeleportToOdyssey = useCallback(() => {
    const worldId = profileStore.userProfile?.id || '';
    profileStore.dialog.close();

    if (isUnityAvailable) {
      console.log(`Teleport in unity to ${worldId}`);
      navigate(generatePath(ROUTES.odyssey.base, {worldId}), {replace: true});
      unityInstanceStore.loadWorldById(worldId, sessionStore.token);
    } else {
      console.log(`Redirect to unity to ${worldId}`);
      navigate(generatePath(ROUTES.odyssey.base, {worldId}), {replace: true});
    }
  }, [profileStore, isUnityAvailable, navigate, unityInstanceStore, sessionStore]);

  const isTeleportAvailable = useMemo(() => {
    return isUnityAvailable
      ? !sessionStore.isGuest && unityStore.worldId !== profileStore.userProfile?.id
      : !sessionStore.isGuest;
  }, [isUnityAvailable, profileStore.userProfile?.id, sessionStore.isGuest, unityStore.worldId]);

  const handleProfileClose = useCallback(() => {
    profileStore.resetModel();
    profileStore.dialog.close();
  }, [profileStore]);

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
                  onChangeKeyboardControl={unityInstanceStore.changeKeyboardControl}
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
                {...(!sessionStore.isGuest && {onSignOut: sessionStore.signOutRedirect})}
                {...(sessionStore.isGuest && {onSignIn: sessionStore.signInRedirect})}
              />
            </styled.Container>
          )}
        </styled.Body>
      </div>
    </Dialog>
  );
};

export default observer(ProfileWidget);
