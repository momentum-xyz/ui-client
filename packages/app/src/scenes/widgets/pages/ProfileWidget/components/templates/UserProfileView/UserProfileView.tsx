import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router';
import {capitalize} from 'lodash-es';
import {generatePath} from 'react-router-dom';
import {Avatar, Button, IconSvg, Text} from '@momentum/ui-kit';
import {UserStatusEnum, absoluteLink, monthAndYearString, withoutProtocol} from '@momentum/core';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';

import {UserSpaceList} from '../../organisms';

import * as styled from './UserProfileView.styled';

interface PropsInterface {
  showUserInteractions: boolean;
  onClose: () => void;
  userId: string;
}

const UserProfileView: FC<PropsInterface> = ({showUserInteractions, onClose, userId}) => {
  const {widgetStore, mainStore, homeStore, flightStore} = useStore();
  const {profileStore} = widgetStore;
  const {unityStore, worldStore} = mainStore;
  const {userSpaceList, userProfile} = profileStore;
  const {exploreStore} = homeStore;

  const history = useHistory();

  const {t} = useTranslation();

  const handleFlyToUser = () => {
    if (userProfile?.uuid) {
      unityStore.teleportToUser(userProfile.uuid);
    }
  };

  const grabATable = async () => {
    const spaceId = await profileStore.grabATable(worldStore.worldId, userId);
    history.push({pathname: generatePath(ROUTES.grabTable, {spaceId})});
    onClose();
  };

  const handleFlyToSpace = (spaceId: string) => {
    unityStore.teleportToSpace(spaceId);
  };

  const handleHighFive = () => {
    if (userProfile?.uuid) {
      unityStore.sendHighFive(userProfile.uuid);
    }
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
        <Avatar avatarSrc={userProfile?.avatarSrc} size="large" status={userProfile?.status} />
        {showUserInteractions && (
          <>
            <Button label={t('actions.flyTo')} onClick={handleFlyToUser} size="small" />
            {userProfile?.status !== UserStatusEnum.DO_NOT_DISTURB && (
              <>
                <Button
                  label={t('actions.grabTable')}
                  onClick={grabATable}
                  size="small"
                  disabled={flightStore.isFlightWithMe}
                />
                <Button label={t('actions.highFive')} onClick={handleHighFive} size="small" />
              </>
            )}
          </>
        )}
      </styled.Actions>
      <styled.Details>
        {userProfile?.profile?.bio && (
          <Text text={userProfile.profile.bio} size="xs" align="left" breakLongWord />
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
          spaceList={userSpaceList}
          flyToSpace={handleFlyToSpace}
          selectSpace={handleSelectSpace}
        />
      </styled.Details>
    </>
  );
};

export default observer(UserProfileView);
