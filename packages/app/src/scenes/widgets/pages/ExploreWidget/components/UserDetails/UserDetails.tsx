import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Universe3dEmitter, useI18n} from '@momentum-xyz/core';
import {Panel, ImageSizeEnum, IconSvg, ItemCard} from '@momentum-xyz/ui-kit-storybook';

import {getImageAbsoluteUrl} from 'core/utils';
import {ProfileInfo, ProfileImage} from 'ui-kit';
import {NftItemModelInterface, UserDetailsModelType} from 'core/models';

import * as styled from './UserDetails.styled';

interface PropsInterface {
  userDetails: UserDetailsModelType;
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

  useEffect(() => {
    Universe3dEmitter.emit('UserSelected', user.id);
  }, [user.id]);

  return (
    <styled.Container data-testid="UserDetails-test">
      <Panel
        isFullHeight
        size="normal"
        icon="astronaut"
        variant="primary"
        image={getImageAbsoluteUrl(user.profile.avatarHash, ImageSizeEnum.S3)}
        title={t('labels.memberProfile')}
        onClose={onClose}
      >
        <styled.Wrapper>
          {/* FIXME: REAL DATA */}
          <ProfileImage
            name={user.name}
            image={user.profile.avatarHash}
            imageErrorIcon="astronaut"
          />

          <styled.GeneralScrollable>
            {/* FIXME: REAL DATA */}
            <ProfileInfo
              hash="some hash"
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
                      imageHeight={95}
                      description="Lorem ipsum dolor sit amet, consectetuer."
                      imageErrorIcon="rabbit_fill"
                      imageUrl={getImageAbsoluteUrl(nft.image, ImageSizeEnum.S5)}
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
                      imageHeight={95}
                      description="Lorem ipsum dolor sit amet, consectetuer."
                      imageErrorIcon="rabbit_fill"
                      imageUrl={getImageAbsoluteUrl(nft.image, ImageSizeEnum.S5)}
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
