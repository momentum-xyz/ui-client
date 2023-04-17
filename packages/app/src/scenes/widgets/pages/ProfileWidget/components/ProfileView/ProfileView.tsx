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
import {NftItemModelInterface, UserModelInterface} from 'core/models';

import * as styled from './ProfileView.styled';

interface PropsInterface {
  user: UserModelInterface;
  nftList: NftItemModelInterface[];
  onInfoNft: (uuid: string) => void;
  onVisitNft: (uuid: string) => void;
}

const ProfileView: FC<PropsInterface> = (props) => {
  const {user, nftList, onInfoNft, onVisitNft} = props;

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

          {nftList.length > 0 && (
            <styled.OwnedOdysseys>
              <styled.OwnedOdysseysTitle>
                <IconSvg name="rabbit_fill" isWhite />
                {t('labels.odysseysOwned')}
              </styled.OwnedOdysseysTitle>

              <styled.NftContainer>
                {nftList.map((nft) => (
                  <ItemCard
                    variant="small"
                    key={nft.uuid}
                    name={nft.name}
                    imageHeight={95}
                    imageUrl={getImageAbsoluteUrl(nft.image)}
                    description="Lorem ipsum dolor sit amet, consectetuer"
                    imageErrorIcon="rabbit_fill"
                    onInfoClick={() => onInfoNft(nft.uuid)}
                    onVisitClick={() => onVisitNft(nft.uuid)}
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
