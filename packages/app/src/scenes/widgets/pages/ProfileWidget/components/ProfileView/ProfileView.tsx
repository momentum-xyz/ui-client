import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {Avatar, Button, Heading, IconSvg, Text} from '@momentum-xyz/ui-kit';
import {absoluteLink, registrationDateString, withoutProtocol} from '@momentum-xyz/core';

import {UserModelInterface} from 'core/models';

import * as styled from './ProfileView.styled';

interface PropsInterface {
  user: UserModelInterface;
  isVisitAvailable: boolean;
  onTeleportToOdyssey: () => void;
}

const ProfileView: FC<PropsInterface> = (props) => {
  const {user, isVisitAvailable, onTeleportToOdyssey} = props;

  const {t} = useTranslation();

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
            <Button
              icon="fly-to"
              size="medium"
              label={t('labels.visit')}
              disabled={!isVisitAvailable}
              onClick={onTeleportToOdyssey}
            />
          </div>
        </styled.NameContainer>
      </styled.AvatarContainer>

      <styled.Info>
        {user.profile?.bio && (
          <Text text={user.profile.bio} size="xxs" align="left" breakLongWord />
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
            text={`${t('actions.joined')} ${registrationDateString(user.createdAt)}`}
            isMultiline={false}
          />
        </styled.InfoItem>
      </styled.Info>
    </>
  );
};

export default observer(ProfileView);
