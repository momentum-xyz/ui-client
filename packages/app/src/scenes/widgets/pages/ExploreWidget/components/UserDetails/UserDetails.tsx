import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Universe3dEmitter, useI18n} from '@momentum-xyz/core';
import {Panel, ImageSizeEnum, IconSvg, ItemCard} from '@momentum-xyz/ui-kit-storybook';

import {getImageAbsoluteUrl} from 'core/utils';
import {ProfileInfo, ProfileImage} from 'ui-kit';
import {UserDetailsModelType, WorldInfoModelInterface} from 'core/models';

import * as styled from './UserDetails.styled';

interface PropsInterface {
  userDetails: UserDetailsModelType;
  worldsOwned: WorldInfoModelInterface[];
  worldsStakedIn: WorldInfoModelInterface[];
  onVisitWorld: (worldId: string) => void;
  onSelectWorld: (worldId: string) => void;
  onClose: () => void;
}

const UserDetails: FC<PropsInterface> = (props) => {
  const {userDetails, worldsOwned, worldsStakedIn, onVisitWorld, onSelectWorld, onClose} = props;
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
          <ProfileImage
            name={user.name}
            image={user.profile.avatarHash}
            imageErrorIcon="astronaut"
          />

          <styled.GeneralScrollable>
            <ProfileInfo
              hash="some hash" // FIXME: REAL DATA
              description={user.description}
              address={user.profile.profileLink}
              joinDate={new Date().toISOString()}
            />

            <styled.OdysseyList>
              {worldsOwned.length > 0 && (
                <>
                  <styled.Title>
                    <IconSvg name="rabbit_fill" size="xs" isWhite />
                    <span>{t('labels.odysseysOwned')}</span>
                  </styled.Title>
                  {worldsOwned.map((world) => (
                    <ItemCard
                      key={world.id}
                      variant="small"
                      name={world.name}
                      imageHeight={95}
                      description={world.description}
                      imageErrorIcon="rabbit_fill"
                      imageUrl={getImageAbsoluteUrl(world.avatarHash, ImageSizeEnum.S5)}
                      onVisitClick={() => onVisitWorld(world.id)}
                      onInfoClick={() => onSelectWorld(world.id)}
                    />
                  ))}
                </>
              )}

              {worldsStakedIn.length > 0 && (
                <>
                  <styled.Title>
                    <IconSvg name="stake" size="xs" isWhite />
                    <span>{t('labels.odysseysStakedIn')}</span>
                  </styled.Title>
                  {worldsStakedIn.map((world) => (
                    <ItemCard
                      key={world.id}
                      variant="small"
                      name={world.name}
                      imageHeight={95}
                      description={world.description}
                      imageErrorIcon="rabbit_fill"
                      imageUrl={getImageAbsoluteUrl(world.avatarHash, ImageSizeEnum.S5)}
                      onVisitClick={() => onVisitWorld(world.id)}
                      onInfoClick={() => onSelectWorld(world.id)}
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
