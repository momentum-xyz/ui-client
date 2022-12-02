import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Dialog, Heading, IconSvg, SvgButton} from '@momentum-xyz/ui-kit';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';

import {MyProfileEditor, MyProfileView} from './components';
import * as styled from './ProfileWidget.styled';

const MENU_OFFSET_LEFT = 10;
const MENU_OFFSET_TOP = 20;

const ProfileWidget: FC = (props) => {
  const {sessionStore, widgetsStore} = useStore();
  const {profileStore} = widgetsStore;

  useEffect(() => {
    profileStore.fetchProfile();

    return () => {
      profileStore.resetModel();
    };
  }, [profileStore, sessionStore.userId]);

  const handleTeleportToOdyssey = useCallback(() => {
    // TODO: implementation
    // unityStore.teleportToSpace(spaceId);
  }, []);

  const handleProfileClose = useCallback(() => {
    profileStore.resetModel();
    profileStore.profileDialog.close();
  }, [profileStore]);

  const handleLogout = useCallback(() => {
    document.location = ROUTES.birthOfMe.signIn;
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
          {!!profileStore.userProfile && !profileStore.isEditingProfile && (
            <MyProfileView
              user={profileStore.userProfile}
              onTeleportToOdyssey={handleTeleportToOdyssey}
              onLogout={handleLogout}
            />
          )}

          {!!profileStore.userProfile && profileStore.isEditingProfile && (
            <MyProfileEditor userId={sessionStore.userId} />
          )}
        </styled.Body>
      </div>
    </Dialog>
  );
};

export default observer(ProfileWidget);
