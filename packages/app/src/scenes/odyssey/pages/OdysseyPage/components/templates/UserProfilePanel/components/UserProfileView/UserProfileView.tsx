import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router';
import {capitalize} from 'lodash-es';
import {generatePath} from 'react-router-dom';
import {Avatar, Button, Heading, IconSvg, Text, UserStatusEnum} from '@momentum-xyz/ui-kit';
import {absoluteLink, monthAndYearString, withoutProtocol} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';
import {UserSpaceList} from 'ui-kit';

import * as styled from './UserProfileView.styled';

interface PropsInterface {
  showUserInteractions: boolean;
  onClose: () => void;
  userId: string;
}

const UserProfileView: FC<PropsInterface> = ({showUserInteractions, onClose, userId}) => {
  const {mainStore, odysseyStore, flightStore} = useStore();
  const {exploreStore, userProfileStore} = odysseyStore;
  const {unityStore, worldStore} = mainStore;
  const {userSpaceList, userProfile} = userProfileStore;

  const history = useHistory();

  const {t} = useTranslation();

  const handleFlyToUser = () => {
    if (userProfile?.id) {
      unityStore.teleportToUser(userProfile.id);
    }
  };

  const grabATable = async () => {
    const spaceId = await userProfileStore.grabATable(worldStore.worldId, userId);
    history.push({pathname: generatePath(ROUTES.grabTable, {spaceId})});
    onClose();
  };

  const handleFlyToSpace = (spaceId: string) => {
    unityStore.teleportToSpace(spaceId);
  };

  const handleHighFive = () => {
    if (userProfile?.id) {
      unityStore.sendHighFive(userProfile.id);
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

        <styled.Initiatives>
          <Heading type="h4" label={`${t('labels.initiatives')}:`} align="left" />
        </styled.Initiatives>

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
