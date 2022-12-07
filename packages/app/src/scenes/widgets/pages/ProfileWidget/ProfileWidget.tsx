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

interface PropsInterface {
  isExploreView: boolean;
}

const ProfileWidget: FC<PropsInterface> = (props) => {
  const {isExploreView} = props;

  const {widgetsStore, sessionStore, mainStore, authStore, nftStore} = useStore();
  const {unityStore, agoraStore, worldStore} = mainStore;
  const {profileStore} = widgetsStore;

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isDeviceSettings, setIsDeviceSettings] = useState<boolean>(false);

  const history = useHistory();

  useEffect(() => {
    profileStore.fetchProfile();

    return () => {
      profileStore.resetModel();
    };
  }, [profileStore]);

  const handleTeleportToOdyssey = useCallback(() => {
    const worldId = profileStore.userProfile?.id || '';

    if (isExploreView) {
      console.log('Redirect to unity');
      console.log(`World ID ${worldId}`);
      profileStore.profileDialog.close();
      history.replace(generatePath(ROUTES.odyssey.base, {worldId}));
    } else {
      console.log('Teleport in unity');
      console.log(`World ID ${worldId}`);
      profileStore.profileDialog.close();
      // TODO: CHECK UNITY
      unityStore.loadWorldById(worldId, authStore.token);
      history.replace(generatePath(ROUTES.odyssey.base, {worldId}));
    }
  }, [profileStore, isExploreView, history, unityStore, authStore]);

  const isTeleportAvailable = useMemo(() => {
    const {userProfile} = profileStore;

    // TODO: removal after wallet will be available in profile
    const nft = nftStore.getNftByUuid(profileStore.userProfile?.id || '');

    if (isExploreView) {
      // return !!userProfile?.wallet;
      return !!nft;
    } else {
      //return !!userProfile?.wallet && worldStore.worldId !== userProfile.id;
      return !!nft && worldStore.worldId !== userProfile?.id;
    }
  }, [isExploreView, nftStore, worldStore.worldId, profileStore.userProfile?.id]);

  const handleProfileClose = useCallback(() => {
    profileStore.resetModel();
    profileStore.profileDialog.close();
  }, [profileStore]);

  const handleLogout = useCallback(() => {
    document.location = ROUTES.signIn;
  }, []);

  return (
    <Dialog
      position="leftTop"
      title=""
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
