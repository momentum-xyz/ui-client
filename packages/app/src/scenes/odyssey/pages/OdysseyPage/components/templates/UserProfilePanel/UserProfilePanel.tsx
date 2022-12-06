import React, {FC, useCallback, useEffect, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {SvgButton, PanelLayout} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';

import {MyProfileEditor, MyProfileView, UserProfileView} from './components';
import * as styled from './UserProfilePanel.styled';

interface PropsInterface {
  userId: string;
  onClose: () => void;
}

const UserProfilePanel: FC<PropsInterface> = (props) => {
  const {userId, onClose} = props;

  const {odysseyStore, sessionStore} = useStore();
  const {userProfileStore} = odysseyStore;
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
    return sessionStore.userId === userProfile?.id;
  }, [sessionStore.userId, userProfile]);

  const handleEditProfile = useCallback(() => {
    userProfileStore.openEdit();
  }, [userProfileStore]);

  if (!userProfile) {
    return <></>;
  }

  return (
    <div data-testid="UserProfilePanel-test">
      {isItMe ? (
        <PanelLayout
          title={t('labels.myBio')}
          headerActions={<SvgButton iconName="edit" size="normal" onClick={handleEditProfile} />}
          componentSize={{width: '390px'}}
          onClose={onClose}
          captureAllPointerEvents
          headerPlaceholder
          titleHeight
        >
          <styled.Body>
            {!userProfileStore.isEditingProfile ? (
              <MyProfileView />
            ) : (
              <MyProfileEditor userId={userId} />
            )}
          </styled.Body>
        </PanelLayout>
      ) : (
        <PanelLayout
          title={t('labels.someonesBio', {name: userProfile?.name || ''})}
          componentSize={{width: '390px'}}
          onClose={onClose}
          captureAllPointerEvents
          headerPlaceholder
          titleHeight
        >
          <styled.Body>
            <UserProfileView userId={userId} showUserInteractions onClose={onClose} />
          </styled.Body>
        </PanelLayout>
      )}
    </div>
  );
};

export default observer(UserProfilePanel);
