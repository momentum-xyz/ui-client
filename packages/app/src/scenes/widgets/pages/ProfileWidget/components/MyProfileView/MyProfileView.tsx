import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {capitalize} from 'lodash-es';
import {Avatar, IconSvg, Text} from '@momentum-xyz/ui-kit';
import {absoluteLink, monthAndYearString, withoutProtocol} from '@momentum-xyz/core';

import {UserModelInterface} from 'core/models';

import * as styled from './MyProfileView.styled';

interface PropsInterface {
  user: UserModelInterface;
}

const MyProfileView: FC<PropsInterface> = (props) => {
  const {user} = props;

  //const {homeStore} = useStore();
  //const {unityStore} = mainStore;

  const {t} = useTranslation();

  /*const handleFlyToSpace = (spaceId: string) => {
    unityStore.teleportToSpace(spaceId);
  };*/

  const renderDate = () => {
    if (!user?.createdAt) {
      return;
    }
    const date = new Date(user.createdAt);
    return monthAndYearString(date);
  };

  return (
    <div>
      <styled.AvatarContainer>
        <Avatar avatarSrc={user?.avatarSrc} size="normal" status={user?.status} />
        <div></div>
      </styled.AvatarContainer>
      <styled.Details>
        {user?.profile?.bio && (
          <Text text={user.profile.bio} size="xs" align="left" breakLongWord />
        )}
        <styled.Info>
          {user?.profile?.location && (
            <styled.InfoItem>
              <IconSvg name="location" size="normal" />
              <styled.LocationText text={user.profile.location} size="xxs" isMultiline={false} />
            </styled.InfoItem>
          )}

          {user?.profile?.profileLink && (
            <styled.InfoItem>
              <IconSvg name="link" size="normal" />
              <styled.Link href={absoluteLink(user.profile.profileLink)} target="_blank">
                {withoutProtocol(user.profile.profileLink)}
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
      </styled.Details>
    </div>
  );
};

export default observer(MyProfileView);
