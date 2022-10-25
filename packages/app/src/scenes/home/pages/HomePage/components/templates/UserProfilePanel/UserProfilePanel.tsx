import React, {FC, useEffect, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {SvgButton, PanelLayout} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';

import {MyProfileEditor, MyProfileView, UserProfileView} from './components';
import * as styled from './UserProfilePanel.styled';

interface PropsInterface {
  userId: string;
  onClose: () => void;
  hasBorder?: boolean;
  editingAvailable?: boolean;
}

// TODO: Remove props
const UserProfilePanel: FC<PropsInterface> = ({userId, hasBorder, editingAvailable, onClose}) => {
  const {homeStore, sessionStore} = useStore();
  const {userProfileStore} = homeStore;
  const {userProfile} = userProfileStore;

  const {t} = useTranslation();

  useEffect(() => {
    userProfileStore.fetchProfile(userId);
    userProfileStore.fetchUserSpaceList(userId);

    return () => {
      userProfileStore.resetModel();
    };
  }, [userProfileStore, userId]);

  const isItMe = useMemo(() => {
    return sessionStore.userId === userProfile?.uuid;
  }, [sessionStore.userId, userProfile]);

  return (
    <PanelLayout
      title={
        isItMe
          ? t('labels.myBio')
          : userProfile && t('labels.someonesBio', {name: userProfile.name})
      }
      captureAllPointerEvents
      headerActions={
        isItMe &&
        editingAvailable && (
          <SvgButton iconName="edit" size="normal" onClick={userProfileStore.openEdit} />
        )
      }
      onClose={onClose}
      componentSize={{width: '390px'}}
      headerPlaceholder
      titleHeight
      hasBorder={hasBorder}
    >
      <styled.Body data-testid="ProfileWidget-test">
        {sessionStore.userId && userProfile && (
          <>
            {!isItMe ? (
              <UserProfileView userId={userId} onClose={onClose} showUserInteractions={false} />
            ) : isItMe && !userProfileStore.isEditingProfile ? (
              <MyProfileView />
            ) : (
              isItMe &&
              userProfileStore.isEditingProfile && <MyProfileEditor userId={userId || ''} />
            )}
          </>
        )}
      </styled.Body>
    </PanelLayout>
  );
};

export default observer(UserProfilePanel);
