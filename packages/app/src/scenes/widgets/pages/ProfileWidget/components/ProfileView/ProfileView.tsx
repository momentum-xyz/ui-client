import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {capitalize} from 'lodash-es';
import {Avatar, Button, Heading, IconSvg, Text} from '@momentum-xyz/ui-kit';
import {absoluteLink, monthAndYearString, withoutProtocol} from '@momentum-xyz/core';

import {UserModelInterface} from 'core/models';

import * as styled from './ProfileView.styled';

interface PropsInterface {
  user: UserModelInterface;
  onTeleportToOdyssey: () => void;
}

const ProfileView: FC<PropsInterface> = (props) => {
  const {user, onTeleportToOdyssey} = props;

  const {t} = useTranslation();

  const renderDate = () => {
    if (!user.createdAt) {
      return '';
    }
    const date = new Date(user.createdAt);
    return monthAndYearString(date);
  };

  return (
    <>
      <styled.AvatarContainer>
        <Avatar avatarSrc={user.avatarSrc} size="normal" status={user.status} />
        <styled.NameContainer>
          <Heading
            type="h1"
            label={user.name}
            isTruncate
            transform="uppercase"
            align="left"
            weight="bold"
          />
          <div>
            <Button icon="fly-to" size="medium" label="Visit" onClick={onTeleportToOdyssey} />
          </div>
        </styled.NameContainer>
      </styled.AvatarContainer>

      <styled.Info>
        {user.profile?.bio && (
          <Text text={user.profile.bio} size="xxs" align="left" breakLongWord />
        )}

        {user.profile?.location && (
          <styled.InfoItem>
            <IconSvg name="locator" size="normal" />
            <styled.LocationText text={user.profile.location} size="xxs" isMultiline={false} />
          </styled.InfoItem>
        )}

        {user.profile?.profileLink && (
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
            size="xxs"
            text={`${capitalize(t('actions.joined'))} ${renderDate()}`}
            isMultiline={false}
          />
        </styled.InfoItem>
      </styled.Info>
    </>
  );
};

export default observer(ProfileView);
