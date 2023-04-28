import {FC, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Universe3dEmitter, useI18n} from '@momentum-xyz/core';
import {
  Panel,
  ImageSizeEnum,
  IconSvg,
  SymbolAmount,
  Hexagon,
  ButtonEllipse
} from '@momentum-xyz/ui-kit-storybook';

import {formatBigInt, getImageAbsoluteUrl} from 'core/utils';
import {ProfileInfo, ProfileImage} from 'ui-kit';
import {WorldModelInterface} from 'core/models';

import * as styled from './WorldDetails.styled';

interface PropsInterface {
  world: WorldModelInterface;
  onSelectUser: (userId: string) => void;
  onVisitWorld: (worldId: string) => void;
  onStakeWorld: (worldId: string) => void;
  onClose: () => void;
}

const USERS_MAX = 2;

const WorldDetails: FC<PropsInterface> = ({
  world,
  onVisitWorld,
  onStakeWorld,
  onSelectUser,
  onClose
}) => {
  const {id, stakers} = world;

  const [isButtonShown, setIsButtonShown] = useState((stakers?.length || 0) > USERS_MAX);
  const {t} = useI18n();

  useEffect(() => {
    Universe3dEmitter.emit('WorldSelected', id);
  }, [id]);

  return (
    <styled.Container data-testid="WorldDetails-test">
      <Panel
        isFullHeight
        size="normal"
        icon="rabbit_fill"
        variant="primary"
        image={getImageAbsoluteUrl(world?.avatarHash, ImageSizeEnum.S3)}
        title={t('labels.odysseyOverview')}
        onClose={onClose}
      >
        <styled.Wrapper>
          <ProfileImage
            name={world.name || world.id}
            image={world.avatarHash}
            imageErrorIcon="rabbit_fill"
            byName={world.owner_name || ''}
            onByClick={() => onSelectUser(world.owner_id)}
          />

          <styled.GeneralScrollable>
            <ProfileInfo
              description={world.description}
              joinDate={world.createdAt}
              onVisit={() => onVisitWorld(world.id)}
              onStake={() => onStakeWorld(world.id)}
            />

            <styled.TitleContainer>
              <styled.Title>
                <IconSvg name="stake" size="xs" isWhite />
                <span>{t('labels.staked')}</span>
              </styled.Title>
            </styled.TitleContainer>

            <styled.TotalAmount>
              <div>{t('labels.totalAmountStaked')}:</div>
              <SymbolAmount stringValue={formatBigInt(world.momStaked)} tokenSymbol="MOM" />
            </styled.TotalAmount>

            {!!world.last_staking_comment && (
              <styled.StakingCommentContainer>
                <div>{t('labels.lastStakingComment')}:</div>
                <styled.StakingComment>{world.last_staking_comment}</styled.StakingComment>
              </styled.StakingCommentContainer>
            )}

            {stakers && (stakers?.length || 0) > 0 && (
              <styled.StakedInUsersContainer>
                <styled.Title>
                  <IconSvg name="connect" size="xs" isWhite />
                  <span>{t('labels.connections')}</span>
                </styled.Title>

                {(isButtonShown ? stakers.slice(0, USERS_MAX) : stakers).map((user, index) => {
                  const username = user.name || user.user_id;
                  return (
                    <styled.StakedInUser
                      key={user.user_id}
                      onClick={() => onSelectUser(user.user_id)}
                    >
                      <Hexagon
                        type="fourth-borderless"
                        skipOuterBorder
                        imageSrc={user.avatarHash}
                      />
                      <styled.Link>
                        {index < USERS_MAX ? `${t('labels.topConnector')}: ${username}` : username}
                      </styled.Link>
                    </styled.StakedInUser>
                  );
                })}

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
