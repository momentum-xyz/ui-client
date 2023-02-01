import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath, useHistory} from 'react-router-dom';
import {Dialog, Heading, IconSvg, SvgButton} from '@momentum-xyz/ui-kit';

import {ProfileFormInterface} from 'core/interfaces';
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

  const history = useHistory();

  useEffect(() => {
    return () => {
      profileStore.resetModel();
    };
  }, [profileStore, sessionStore]);

  const handleTeleportToOdyssey = useCallback(() => {
    const worldId = sessionStore.userId;
    profileStore.dialog.close();

    if (isUnityAvailable) {
      console.log(`Teleport in unity to ${worldId}`);
      history.replace(generatePath(ROUTES.odyssey.base, {worldId}));
      unityInstanceStore.loadWorldById(worldId, sessionStore.token);
    } else {
      console.log(`Redirect to unity to ${worldId}`);
      history.replace(generatePath(ROUTES.odyssey.base, {worldId}));
    }
  }, [profileStore, isUnityAvailable, history, unityInstanceStore, sessionStore]);

  const isTeleportAvailable = useMemo(() => {
    return isUnityAvailable
      ? !sessionStore.isGuest && unityStore.worldId !== sessionStore.userId
      : !sessionStore.isGuest;
  }, [isUnityAvailable, sessionStore.userId, sessionStore.isGuest, unityStore.worldId]);

  const handleProfileUpdate = useCallback(
    async (form: ProfileFormInterface, previousImageHash?: string) => {
      if (await profileStore.editProfile(form, previousImageHash)) {
        await sessionStore.loadUserProfile();
        setIsEditMode(false);
        return true;
      }
      return false;
    },
    [profileStore, sessionStore]
  );

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
          {!!sessionStore.user && (
            <styled.Container>
              {!isEditMode && (
                <ProfileView
                  isVisitAvailable={isTeleportAvailable}
                  user={sessionStore.user}
                  onTeleportToOdyssey={handleTeleportToOdyssey}
                />
              )}

              {isEditMode && (
                <ProfileEditor
                  user={sessionStore.user}
                  formErrors={profileStore.formErrors}
                  isUpdating={profileStore.isUpdating}
                  onChangeKeyboardControl={unityInstanceStore.changeKeyboardControl}
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
              />
            </styled.Container>
          )}
        </styled.Body>
      </div>
    </Dialog>
  );
};

export default observer(ProfileWidget);
