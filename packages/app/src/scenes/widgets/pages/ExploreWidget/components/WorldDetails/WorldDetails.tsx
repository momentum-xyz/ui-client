import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Universe3dEmitter, useI18n} from '@momentum-xyz/core';
import {Panel, ImageSizeEnum, IconSvg, SymbolAmount} from '@momentum-xyz/ui-kit-storybook';

import {formatBigInt, getImageAbsoluteUrl} from 'core/utils';
import {ProfileInfo, ProfileImage, StakersList} from 'ui-kit';
import {WorldModelInterface} from 'core/models';

import * as styled from './WorldDetails.styled';

interface PropsInterface {
  world: WorldModelInterface;
  onSelectUser: (userId: string) => void;
  onVisitWorld: (worldId: string) => void;
  onStakeWorld: (worldId: string) => void;
  onClose: () => void;
}

const WorldDetails: FC<PropsInterface> = ({
  world,
  onVisitWorld,
  onStakeWorld,
  onSelectUser,
  onClose
}) => {
  const {t} = useI18n();

  useEffect(() => {
    Universe3dEmitter.emit('WorldSelected', world.id);
  }, [world.id]);

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

            <StakersList stakers={world.stakers} onSelectUser={onSelectUser} />
          </styled.GeneralScrollable>
        </styled.Wrapper>
      </Panel>
    </styled.Container>
  );
};

export default observer(WorldDetails);
