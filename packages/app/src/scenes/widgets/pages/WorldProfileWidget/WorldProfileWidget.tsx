import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Panel, ImageSizeEnum, PositionEnum, Frame} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';
import {getImageAbsoluteUrl} from 'core/utils';
import {ProfileImage, ProfileInfo, StakersList, StakingAmount, StakingComment} from 'ui-kit';

import * as styled from './WorldProfileWidget.styled';

const WorldProfileWidget: FC = () => {
  const {widgetManagerStore, universeStore} = useStore();
  const {world2dStore} = universeStore;

  const {t} = useI18n();

  const onSelectUser = (userId: string) => {
    widgetManagerStore.open(WidgetEnum.USER_DETAILS, PositionEnum.LEFT, {id: userId});
  };

  const onStakeWorld = () => {
    widgetManagerStore.open(WidgetEnum.STAKING, PositionEnum.RIGHT);
  };

  if (!world2dStore?.worldDetails?.world) {
    return <></>;
  }

  const {world} = world2dStore.worldDetails;

  return (
    <styled.Container data-testid="WorldProfileWidget-test">
      <styled.PanelContainer>
        <Panel
          isFullHeight
          size="normal"
          variant="primary"
          icon="rabbit_fill"
          title={t('labels.odysseyOverview')}
          image={getImageAbsoluteUrl(world?.avatarHash, ImageSizeEnum.S3)}
          onClose={() => widgetManagerStore.close(WidgetEnum.WORLD_PROFILE)}
        >
          <styled.Wrapper>
            <Frame>
              <ProfileImage
                name={world.name || world.id}
                image={world.avatarHash}
                imageErrorIcon="rabbit_fill"
                byName={world.owner_name || world.owner_id}
                onByClick={() => onSelectUser(world.owner_id)}
              />

              <ProfileInfo
                description={world.description}
                weblink={world.website_link}
                createDate={world.createdAt}
                onStake={onStakeWorld}
              />
            </Frame>

            <styled.StakingWrapper>
              <StakingAmount stakedAmount={world.momStaked} tokenSymbol="MOM" />

              {!!world.last_staking_comment && (
                <StakingComment comment={world.last_staking_comment} />
              )}

              <StakersList stakers={world.stakers} onSelectUser={onSelectUser} />
            </styled.StakingWrapper>
          </styled.Wrapper>
        </Panel>
      </styled.PanelContainer>
    </styled.Container>
  );
};

export default observer(WorldProfileWidget);
