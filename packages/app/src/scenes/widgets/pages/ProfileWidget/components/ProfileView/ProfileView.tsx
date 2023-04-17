import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Image, Frame, IconSvg, ProfileLine, WalletHash} from '@momentum-xyz/ui-kit-storybook';
import {absoluteLink, withoutProtocol, useI18n, signUpDateString} from '@momentum-xyz/core';

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
        <Image src={user.avatarLargeSrc} height={200} />
        <styled.NameContainer>{user.name}</styled.NameContainer>

        <styled.ScrollableContainer>
          <styled.GeneralInfo>
            {user.profile?.bio && <div>{user.profile?.bio}</div>}
            {user.profile.profileLink && (
              <ProfileLine
                icon="link"
                label={
                  <styled.LinkAccent target="_blank" href={absoluteLink(user.profile.profileLink)}>
                    {withoutProtocol(user.profile.profileLink)}
                  </styled.LinkAccent>
                }
              />
            )}
            <ProfileLine
              icon="astro"
              label={`${t('actions.joined')} ${signUpDateString(user.createdAt)}`}
            />
            <WalletHash icon="talisman" hash={user.wallet || ''} />
          </styled.GeneralInfo>

          <styled.OwnedOdysseys>
            <styled.OwnedOdysseysTitle>
              <IconSvg name="rabbit_fill" isWhite />
              {t('labels.odysseysOwned')}
            </styled.OwnedOdysseysTitle>
          </styled.OwnedOdysseys>
        </styled.ScrollableContainer>
      </Frame>
    </styled.Container>
  );
};

export default observer(ProfileView);
