import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath, useNavigate} from 'react-router-dom';
import {useI18n} from '@momentum-xyz/core';
import {
  Panel,
  IconSvg,
  SymbolAmount,
  ImageSizeEnum,
  PositionEnum
} from '@momentum-xyz/ui-kit-storybook';

import {useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';
import {ROUTES} from 'core/constants';
import {formatBigInt, getImageAbsoluteUrl} from 'core/utils';
import {ProfileImage, ProfileInfo, StakersList} from 'ui-kit';

import * as styled from './WorldProfileWidget.styled';

const WorldProfileWidget: FC = () => {
  const {widgetManagerStore, universeStore} = useStore();
  const {world2dStore} = universeStore;

  const {t} = useI18n();
  const navigate = useNavigate();

  const onSelectUser = (userId: string) => {
    widgetManagerStore.open(WidgetEnum.USER_DETAILS, PositionEnum.LEFT, {id: userId});
  };

  const onStakeWorld = (worldId: string) => {
    navigate(generatePath(ROUTES.odyssey.base, {worldId}));
  };

  if (!world2dStore?.worldDetails?.world) {
    return <></>;
  }

  const {world} = world2dStore.worldDetails;
  const {stakers} = world;

  return (
    <styled.Container data-testid="WorldProfileWidget-test">
      <Panel
        isFullHeight
        size="normal"
        icon="rabbit_fill"
        variant="primary"
        title={t('labels.odysseyOverview')}
        image={getImageAbsoluteUrl(world?.avatarHash, ImageSizeEnum.S3)}
        onClose={() => widgetManagerStore.close(WidgetEnum.WORLD_PROFILE)}
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

            <StakersList stakers={stakers} onSelectUser={onSelectUser} />
          </styled.GeneralScrollable>
        </styled.Wrapper>
      </Panel>
    </styled.Container>
  );
};

export default observer(WorldProfileWidget);
