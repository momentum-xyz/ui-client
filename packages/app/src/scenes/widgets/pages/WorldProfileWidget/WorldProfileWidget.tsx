import {FC, useMemo, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath, useNavigate} from 'react-router-dom';
import {useI18n} from '@momentum-xyz/core';
import {
  Panel,
  ImageSizeEnum,
  PositionEnum,
  SideMenu,
  SideMenuItemInterface
} from '@momentum-xyz/ui-kit-storybook';

import {useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';
import {ROUTES} from 'core/constants';
import {getImageAbsoluteUrl} from 'core/utils';
import {ProfileImage, ProfileInfo, StakersList, StakingAmount, StakingComment} from 'ui-kit';

import * as styled from './WorldProfileWidget.styled';

type MenuItemType = 'viewWorld' | 'editWorld';

const WorldProfileWidget: FC = () => {
  const {widgetManagerStore, universeStore} = useStore();
  const {world2dStore} = universeStore;

  const [activeMenuId, setActiveMenuId] = useState<MenuItemType>('viewWorld');

  const {t} = useI18n();
  const navigate = useNavigate();

  const onSelectUser = (userId: string) => {
    widgetManagerStore.open(WidgetEnum.USER_DETAILS, PositionEnum.LEFT, {id: userId});
  };

  const onStakeWorld = (worldId: string) => {
    navigate(generatePath(ROUTES.odyssey.base, {worldId}));
  };

  const sideMenuItems: SideMenuItemInterface<MenuItemType>[] = useMemo(
    () => [
      {
        id: 'editWorld',
        iconName: 'edit',
        label: t('actions.edit')
      }
    ],
    [t]
  );

  if (!world2dStore?.worldDetails?.world) {
    return <></>;
  }

  const {world} = world2dStore.worldDetails;
  const {stakers} = world;

  return (
    <styled.Container data-testid="WorldProfileWidget-test">
      {world2dStore.isMyWorld && (
        <styled.SideMenuContainer>
          <SideMenu
            orientation="left"
            activeId={activeMenuId}
            sideMenuItems={sideMenuItems}
            onSelect={(menuId) => {
              setActiveMenuId(activeMenuId === menuId ? 'viewWorld' : menuId);
            }}
          />
        </styled.SideMenuContainer>
      )}

      <styled.PanelContainer>
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
              byName={world.owner_name || world.owner_id}
              onByClick={() => onSelectUser(world.owner_id)}
            />

            <styled.GeneralScrollable>
              <ProfileInfo
                description={world.description}
                joinDate={world.createdAt}
                onStake={() => onStakeWorld(world.id)}
              />

              <StakingAmount stakedAmount={world.momStaked} tokenSymbol="MOM" />

              {!!world.last_staking_comment && (
                <StakingComment comment={world.last_staking_comment} />
              )}

              <StakersList stakers={stakers} onSelectUser={onSelectUser} />
            </styled.GeneralScrollable>
          </styled.Wrapper>
        </Panel>
      </styled.PanelContainer>
    </styled.Container>
  );
};

export default observer(WorldProfileWidget);
