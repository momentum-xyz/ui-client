import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {capitalize} from 'lodash-es';
import {Avatar, Button, Heading, IconSvg, Text} from '@momentum-xyz/ui-kit';
import {absoluteLink, monthAndYearString, withoutProtocol} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';
import {UserSpaceList} from 'ui-kit';

import * as styled from './MyProfileView.styled';

const MyProfileView: FC = () => {
  const {widgetStore, sessionStore, mainStore, homeStore} = useStore();
  const {launchInitiativeStore} = widgetStore;
  const {unityStore} = mainStore;
  const {profile: currentUser} = sessionStore;
  const {exploreStore, userProfileStore} = homeStore;
  const {userProfile} = userProfileStore;

  const {t} = useTranslation();

  const handleFlyToSpace = (spaceId: string) => {
    unityStore.teleportToSpace(spaceId);
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
        <Avatar avatarSrc={currentUser?.avatarSrc} size="large" status={currentUser?.status} />
        {userProfileStore.canCreateInitiative && (
          <Button
            label={t('actions.createInitiative')}
            onClick={launchInitiativeStore.dialog.open}
            size="small"
          />
        )}
      </styled.Actions>
      <styled.Details>
        {currentUser?.profile?.bio && (
          <Text text={currentUser.profile.bio} size="xs" align="left" breakLongWord />
        )}
        <styled.Info>
          {currentUser?.profile?.location && (
            <styled.InfoItem>
              <IconSvg name="location" size="normal" />
              <styled.LocationText
                text={currentUser.profile.location}
                size="xxs"
                isMultiline={false}
              />
            </styled.InfoItem>
          )}

          {currentUser?.profile?.profileLink && (
            <styled.InfoItem>
              <IconSvg name="link" size="normal" />
              <styled.Link href={absoluteLink(currentUser.profile.profileLink)} target="_blank">
                {withoutProtocol(currentUser.profile.profileLink)}
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

        <styled.Initiatives>
          <Heading type="h4" label={`${t('labels.initiatives')}:`} align="left" />
        </styled.Initiatives>

        <UserSpaceList
          spaceList={userProfileStore.userSpaceList}
          flyToSpace={handleFlyToSpace}
          selectSpace={handleSelectSpace}
        />
      </styled.Details>
    </>
  );
};

export default observer(MyProfileView);
