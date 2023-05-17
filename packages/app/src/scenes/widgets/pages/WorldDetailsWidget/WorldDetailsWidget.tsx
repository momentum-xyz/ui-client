import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath, useNavigate} from 'react-router-dom';
import {Universe3dEmitter, useI18n} from '@momentum-xyz/core';
import {Panel, ImageSizeEnum, PositionEnum} from '@momentum-xyz/ui-kit';

import {useNavigation, useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';
import {ROUTES} from 'core/constants';
import {getImageAbsoluteUrl} from 'core/utils';
import {ProfileImage, ProfileInfo, StakersList, StakingAmount, StakingComment} from 'ui-kit';
import {WidgetInfoModelInterface} from 'stores/WidgetManagerStore';

import * as styled from './WorldDetailsWidget.styled';

const WorldDetailsWidget: FC<WidgetInfoModelInterface> = ({data}) => {
  const {widgetManagerStore, widgetStore} = useStore();
  const {worldDetailsStore} = widgetStore;
  const {worldDetails} = worldDetailsStore;

  const {t} = useI18n();
  const navigate = useNavigate();
  const {goToOdysseyHome} = useNavigation();

  useEffect(() => {
    if (data?.id) {
      Universe3dEmitter.emit('WorldSelected', data.id.toString());
      worldDetailsStore.init(data.id.toString());
    }

    return () => {
      worldDetailsStore.resetModel();
    };
  }, [worldDetailsStore, data?.id]);

  const onSelectUser = (userId: string) => {
    widgetManagerStore.open(WidgetEnum.USER_DETAILS, PositionEnum.LEFT, {id: userId});
  };

  const onVisitWorld = (worldId: string) => {
    goToOdysseyHome(worldId);
  };

  const onStakeWorld = (worldId: string) => {
    navigate(generatePath(ROUTES.odyssey.base, {worldId}));
  };

  if (!worldDetails?.world) {
    return <></>;
  }

  const {world} = worldDetails;

  return (
    <styled.Container data-testid="WorldDetailsWidget-test">
      <Panel
        isFullHeight
        size="normal"
        icon="rabbit_fill"
        variant="primary"
        title={t('labels.odysseyOverview')}
        image={getImageAbsoluteUrl(world?.avatarHash, ImageSizeEnum.S3)}
        onClose={() => widgetManagerStore.close(WidgetEnum.WORLD_DETAILS)}
      >
        <styled.Wrapper>
          <ProfileImage
            name={world.name || world.id}
            image={world.avatarHash}
            imageErrorIcon="rabbit_fill"
            byName={world.owner_name || world.owner_id}
            onByClick={() => onSelectUser(world.owner_id)}
          />

          <styled.GeneralScrollable>
            <ProfileInfo
              description={world.description}
              weblink={world.website_link}
              createDate={world.createdAt}
              onVisit={() => onVisitWorld(world.id)}
              onStake={() => onStakeWorld(world.id)}
            />

            <StakingAmount stakedAmount={world.momStaked} tokenSymbol="MOM" />

            {!!world.last_staking_comment && (
              <StakingComment comment={world.last_staking_comment} />
            )}

            <StakersList stakers={world.stakers} onSelectUser={onSelectUser} />
          </styled.GeneralScrollable>
        </styled.Wrapper>
      </Panel>
    </styled.Container>
  );
};

export default observer(WorldDetailsWidget);
