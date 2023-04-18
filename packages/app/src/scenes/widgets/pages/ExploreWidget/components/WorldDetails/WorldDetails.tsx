import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {
  Panel,
  ImageSizeEnum,
  IconSvg,
  SymbolAmount,
  Hexagon,
  ButtonEllipse
} from '@momentum-xyz/ui-kit-storybook';

import {getImageAbsoluteUrl} from 'core/utils';
import {ProfileInfo, ProfileImage} from 'ui-kit';
import {WorldDetailsType} from 'stores/UniverseStore/models';

import * as styled from './WorldDetails.styled';

interface PropsInterface {
  worldDetails: WorldDetailsType;
  onSelectUser: (userId: string) => void;
  onVisitWorld: (worldId: string) => void;
  onStakeWorld: (worldId: string) => void;
  onClose: () => void;
}

const USERS_MAX = 2;

const WorldDetails: FC<PropsInterface> = ({
  worldDetails,
  onVisitWorld,
  onStakeWorld,
  onSelectUser,
  onClose
}) => {
  const {world, usersStakedIn, lastStakingComment, totalAmountStaked} = worldDetails;

  const [isButtonShown, setIsButtonShown] = useState(usersStakedIn.length > USERS_MAX);

  const {t} = useI18n();

  return (
    <styled.Container data-testid="WorldDetails-test">
      <Panel
        isFullHeight
        size="normal"
        icon="rabbit_fill"
        variant="primary"
        image={getImageAbsoluteUrl(world.image, ImageSizeEnum.S3)}
        title={t('labels.odysseyOverview')}
        onClose={onClose}
      >
        <styled.Wrapper>
          {/* FIXME: REAL DATA */}
          <ProfileImage
            name={world.name}
            image={world.image}
            imageErrorIcon="rabbit_fill"
            byName={world.name}
            onByClick={() => onSelectUser(world.uuid)}
          />

          <styled.GeneralScrollable>
            {/* FIXME: REAL DATA */}
            <ProfileInfo
              description="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean commodo ligula eget dolor..."
              address="http://www.google.com"
              joinDate={new Date().toISOString()}
              onVisit={() => onVisitWorld(world.uuid)}
              onStake={() => onStakeWorld(world.uuid)}
            />

            <styled.TitleContainer>
              <styled.Title>
                <IconSvg name="stake" size="xs" isWhite />
                <span>{t('labels.staked')}</span>
              </styled.Title>
            </styled.TitleContainer>

            <styled.TotalAmount>
              <div>{t('labels.totalAmountStaked')}:</div>
              <SymbolAmount value={totalAmountStaked} tokenSymbol="MOM" />
            </styled.TotalAmount>

            {!!lastStakingComment && (
              <styled.StakingCommentContainer>
                <div>{t('labels.lastStakingComment')}:</div>
                <styled.StakingComment>{lastStakingComment}</styled.StakingComment>
              </styled.StakingCommentContainer>
            )}

            {usersStakedIn.length > 0 && (
              <styled.StakedInUsersContainer>
                <styled.Title>
                  <IconSvg name="connect" size="xs" isWhite />
                  <span>{t('labels.connections')}</span>
                </styled.Title>

                {(isButtonShown ? usersStakedIn.slice(0, USERS_MAX) : usersStakedIn).map(
                  (user, index) => (
                    <styled.StakedInUser key={user.uuid} onClick={() => onSelectUser(user.uuid)}>
                      <Hexagon type="fourth-borderless" skipOuterBorder imageSrc={user.image} />
                      <styled.Link>
                        {index < USERS_MAX
                          ? `${t('labels.topConnector')}: ${user.name}`
                          : user.name}
                      </styled.Link>
                    </styled.StakedInUser>
                  )
                )}

                {isButtonShown && (
                  <styled.ShowAllButtonContainer>
                    <ButtonEllipse
                      label={t('actions.seeAll')}
                      onClick={() => setIsButtonShown(false)}
                    />
                  </styled.ShowAllButtonContainer>
                )}
              </styled.StakedInUsersContainer>
            )}
          </styled.GeneralScrollable>
        </styled.Wrapper>
      </Panel>
    </styled.Container>
  );
};

export default observer(WorldDetails);
