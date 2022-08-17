import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router';
import {capitalize} from 'lodash-es';

import {Avatar, Button, IconSvg, Text} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';
import {absoluteLink, monthAndYearString, withoutProtocol} from 'core/utils';

import {UserSpaceList} from '../../organisms';

import * as styled from './MyProfileView.styled';

const MyProfileView: FC = () => {
  const {widgetStore, sessionStore, mainStore, homeStore} = useStore();
  const {profileStore, launchInitiativeStore} = widgetStore;
  const {unityStore} = mainStore;
  const {profile: currentUser} = sessionStore;
  const {userProfile} = profileStore;
  const {exploreStore} = homeStore;

  const history = useHistory();

  const {t} = useTranslation();

  const handleFlyToSpace = (spaceId: string) => {
    unityStore.teleportToSpace(spaceId);
    history.push(ROUTES.base);
  };

  const handleSelectSpace = (spaceId: string) => {
    exploreStore.selectSpace(spaceId);
  };

  const renderDate = () => {
    if (!userProfile?.createdAt) {
      return;
    }
    const date = new Date(userProfile.createdAt);
    return monthAndYearString(date);
  };

  return (
    <>
      <styled.Actions>
        <Avatar
          avatarSrc={sessionStore.profile?.avatarSrc}
          size="large"
          status={currentUser?.status}
        />
        {profileStore.canCreateInitiative && (
          <Button
            label={t('actions.createInitiative')}
            onClick={launchInitiativeStore.dialog.open}
            size="small"
          />
        )}
      </styled.Actions>
      <styled.Details>
        {userProfile?.profile?.bio && (
          <Text text={userProfile.profile.bio} size="xs" align="left" />
        )}
        <styled.Info>
          {userProfile?.profile?.location && (
            <styled.InfoItem>
              <IconSvg name="location" size="normal" />
              <styled.LocationText
                text={userProfile.profile.location}
                size="xxs"
                isMultiline={false}
              />
            </styled.InfoItem>
          )}

          {userProfile?.profile?.profileLink && (
            <styled.InfoItem>
              <IconSvg name="link" size="normal" />
              <styled.Link href={absoluteLink(userProfile.profile.profileLink)} target="_blank">
                {withoutProtocol(userProfile.profile.profileLink)}
              </styled.Link>
            </styled.InfoItem>
          )}

          <styled.InfoItem>
            <IconSvg name="astro" size="normal" />
            <Text
              text={`${capitalize(t('actions.joined'))} ${renderDate() as string}`}
              size="xxs"
              isMultiline={false}
            />
          </styled.InfoItem>
        </styled.Info>
        <UserSpaceList
          spaceList={profileStore.userSpaceList}
          flyToSpace={handleFlyToSpace}
          selectSpace={handleSelectSpace}
        />
      </styled.Details>
    </>
  );
};

export default observer(MyProfileView);
