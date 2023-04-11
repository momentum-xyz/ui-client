import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Panel, ImageSizeEnum, IconSvg} from '@momentum-xyz/ui-kit-storybook';

import {getImageAbsoluteUrl} from 'core/utils';
import {ProfileInfo, ProfileImage, ItemCard} from 'ui-kit';
import {NftItemModelInterface} from 'core/models';
import {UserDetailsType} from 'stores/UniverseStore/models';

import * as styled from './UserDetails.styled';

interface PropsInterface {
  userDetails: UserDetailsType;
  nftOwned: NftItemModelInterface[];
  nftStakedIn: NftItemModelInterface[];
  onVisitWorld: (worldId: string) => void;
  onSelectWorld: (worldId: string) => void;
  onClose: () => void;
}

const UserDetails: FC<PropsInterface> = (props) => {
  const {userDetails, nftOwned, nftStakedIn, onVisitWorld, onSelectWorld, onClose} = props;
  const {user} = userDetails;

  const {t} = useI18n();

  return (
    <styled.Container data-testid="UserDetails-test">
      <Panel
        icon="astronaut"
        variant="primary"
        image={getImageAbsoluteUrl(user.image, ImageSizeEnum.S3)}
        title={t('labels.memberProfile')}
        onClose={onClose}
      >
        <styled.Wrapper>
          {/* FIXME: REAL DATA */}
          <ProfileImage name={user.name} image={user.image} imageErrorIcon="astronaut" />

          <styled.GeneralScrollable>
            {/* FIXME: REAL DATA */}
            <ProfileInfo
              hash={user.owner}
              description="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean commodo ligula eget dolor..."
              address="http://www.google.com"
              joinDate={new Date().toISOString()}
            />

            <styled.OdysseyList>
              {nftOwned.length > 0 && (
                <>
                  <styled.Title>
                    <IconSvg name="rabbit_fill" size="xs" isWhite />
                    <span>{t('labels.odysseysOwned')}</span>
                  </styled.Title>
                  {nftOwned.map((nft) => (
                    <ItemCard
                      key={nft.uuid}
                      variant="small"
                      name={nft.name}
                      image={nft.image}
                      imageHeight={95}
                      description="Lorem ipsum dolor sit amet, consectetuer."
                      imageErrorIcon="rabbit_fill"
                      onVisitClick={() => onVisitWorld(nft.uuid)}
                      onInfoClick={() => onSelectWorld(nft.uuid)}
                    />
                  ))}
                </>
              )}

              {nftStakedIn.length > 0 && (
                <>
                  <styled.Title>
                    <IconSvg name="stake" size="xs" isWhite />
                    <span>{t('labels.odysseysStakedIn')}</span>
                  </styled.Title>
                  {nftStakedIn.map((nft) => (
                    <ItemCard
                      key={nft.uuid}
                      variant="small"
                      name={nft.name}
                      image={nft.image}
                      imageHeight={95}
                      description="Lorem ipsum dolor sit amet, consectetuer."
                      imageErrorIcon="rabbit_fill"
                      onVisitClick={() => onVisitWorld(nft.uuid)}
                      onInfoClick={() => onSelectWorld(nft.uuid)}
                    />
                  ))}
                </>
              )}
            </styled.OdysseyList>
          </styled.GeneralScrollable>
        </styled.Wrapper>
      </Panel>
    </styled.Container>
  );
};

export default observer(UserDetails);
