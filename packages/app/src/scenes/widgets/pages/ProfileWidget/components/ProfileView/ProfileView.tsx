import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {
  Image,
  Frame,
  IconSvg,
  ProfileLine,
  WalletHash,
  ItemCard
} from '@momentum-xyz/ui-kit-storybook';
import {absoluteLink, withoutProtocol, useI18n, signUpDateString} from '@momentum-xyz/core';

import {getImageAbsoluteUrl} from 'core/utils';
import {UserModelInterface, WorldInfoModelInterface} from 'core/models';

import * as styled from './ProfileView.styled';

interface PropsInterface {
  user: UserModelInterface;
  defaultWalletId: string;
  worldList: WorldInfoModelInterface[];
  onInfoWorld: (uuid: string) => void;
  onVisitWorld: (uuid: string) => void;
}

const ProfileView: FC<PropsInterface> = (props) => {
  const {user, defaultWalletId, worldList, onInfoWorld, onVisitWorld} = props;

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
            <WalletHash icon="talisman" hash={defaultWalletId || ''} />
          </styled.GeneralInfo>

          {worldList.length > 0 && (
            <styled.OwnedOdysseys>
              <styled.OwnedOdysseysTitle>
                <IconSvg name="rabbit_fill" isWhite />
                {t('labels.odysseysOwned')}
              </styled.OwnedOdysseysTitle>

              <styled.NftContainer>
                {worldList.map((world) => (
                  <ItemCard
                    variant="small"
                    key={world.id}
                    name={world.name}
                    description={world.description}
                    imageHeight={95}
                    imageErrorIcon="rabbit_fill"
                    imageUrl={getImageAbsoluteUrl(world.avatarHash)}
                    onInfoClick={() => onInfoWorld(world.id)}
                    onVisitClick={() => onVisitWorld(world.id)}
                  />
                ))}
              </styled.NftContainer>
            </styled.OwnedOdysseys>
          )}
        </styled.ScrollableContainer>
      </Frame>
    </styled.Container>
  );
};

export default observer(ProfileView);
