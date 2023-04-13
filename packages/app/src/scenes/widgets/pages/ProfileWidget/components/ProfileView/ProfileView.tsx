import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {ButtonRound, Image, Frame, IconSvg} from '@momentum-xyz/ui-kit-storybook';
import {absoluteLink, registrationDateString, withoutProtocol, useI18n} from '@momentum-xyz/core';

import {UserModelInterface} from 'core/models';

import * as styled from './ProfileView.styled';

interface PropsInterface {
  user: UserModelInterface;
}

const ProfileView: FC<PropsInterface> = (props) => {
  const {user} = props;

  const {t} = useI18n();

  return (
    <styled.Container>
      <Frame>
        <Image src={user.avatarSrc} height={200} />
        <styled.UserInfo>
          <styled.NameContainer>{user.name}</styled.NameContainer>
          <styled.AddressContainer>{user.wallet}</styled.AddressContainer>
          {user.profile?.bio && <styled.BioContainer>{user.profile?.bio}</styled.BioContainer>}

          {user.profile.profileLink && (
            <styled.InfoItem>
              <ButtonRound variant="primary" isLabel icon="link" />
              <styled.Link href={absoluteLink(user.profile.profileLink)} target="_blank">
                {withoutProtocol(user.profile.profileLink)}
              </styled.Link>
            </styled.InfoItem>
          )}
          <styled.InfoItem>
            <ButtonRound variant="primary" isLabel icon="astronaut" />
            <span>
              {t('actions.joined')} {registrationDateString(user.createdAt)}
            </span>
          </styled.InfoItem>
        </styled.UserInfo>
      </Frame>

      <styled.Separator />

      <styled.OwnedOdysseys>
        <styled.OwnedOdysseysTitle>
          <IconSvg name="rabbit_fill" isWhite />
          Odysseys Owned
        </styled.OwnedOdysseysTitle>
      </styled.OwnedOdysseys>
    </styled.Container>
  );
};

export default observer(ProfileView);
