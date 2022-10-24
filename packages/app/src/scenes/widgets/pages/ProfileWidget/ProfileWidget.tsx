import React, {useEffect, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {SvgButton, PanelLayout} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';

import * as styled from './ProfileWidget.styled';
import {MyProfileEditor, MyProfileView, UserProfileView} from './components';

interface ProfileWidgetPropsInterface {
  userId: string;
  onClose: () => void;
  onEditUser?: (userId: string) => void;
  className?: string;
  hasBorder?: boolean;
  showUserInteractions?: boolean;
  showOverflow?: boolean;
}

const ProfileWidget: React.FC<ProfileWidgetPropsInterface> = ({
  userId,
  onClose,
  onEditUser,
  className,
  hasBorder,
  showOverflow,
  showUserInteractions = true
}) => {
  const {widgetStore, sessionStore} = useStore();
  const {profileStore} = widgetStore;
  const {userProfile} = profileStore;

  const {t} = useTranslation();

  useEffect(() => {
    profileStore.fetchProfile(userId);
    profileStore.fetchUserSpaceList(userId);

    return () => {
      profileStore.resetModel();
    };
  }, [profileStore, userId]);

  const isItMe = useMemo(() => {
    if (!sessionStore.userId || !userProfile) {
      return false;
    }
    return sessionStore.userId === userProfile.uuid;
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
        onEditUser && <SvgButton iconName="edit" size="normal" onClick={profileStore.openEdit} />
      }
      onClose={onClose}
      componentSize={{width: '390px'}}
      className={className}
      hasBorder={hasBorder}
      showOverflow={showOverflow}
      headerPlaceholder
      titleHeight
    >
      <styled.Body data-testid="ProfileWidget-test">
        {sessionStore.userId && userProfile && (
          <>
            {!isItMe ? (
              <UserProfileView
                userId={userId}
                onClose={onClose}
                showUserInteractions={showUserInteractions}
              />
            ) : isItMe && !profileStore.isEditingProfile ? (
              <MyProfileView />
            ) : (
              isItMe && profileStore.isEditingProfile && <MyProfileEditor userId={userId} />
            )}
          </>
        )}
      </styled.Body>
    </PanelLayout>
  );
};

export default observer(ProfileWidget);
