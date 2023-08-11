import {FC, useMemo, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {i18n, useI18n} from '@momentum-xyz/core';
import {
  Panel,
  ImageSizeEnum,
  PositionEnum,
  SideMenu,
  SideMenuItemInterface
} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';
import {getImageAbsoluteUrl} from 'core/utils';

import {WorldMembers, WorldView} from './components';
import * as styled from './WorldProfileWidget.styled';

type MenuItemType = 'viewWorld' | 'editMembers';

const sideMenuItems: SideMenuItemInterface<MenuItemType>[] = [
  {
    id: 'editMembers',
    iconName: 'collaboration',
    label: i18n.t('labels.coCreators')
  }
];

const WorldProfileWidget: FC = () => {
  const {widgetManagerStore, universeStore} = useStore();
  const {world2dStore} = universeStore;

  const [activeMenuId, setActiveMenuId] = useState<MenuItemType>('viewWorld');

  const {t} = useI18n();

  const onSelectUser = (userId: string) => {
    widgetManagerStore.open(WidgetEnum.USER_DETAILS, PositionEnum.LEFT, {id: userId});
  };

  const onStakeWorld = () => {
    widgetManagerStore.open(WidgetEnum.STAKING, PositionEnum.RIGHT);
  };

  const panelIcon = useMemo(() => {
    if (activeMenuId !== 'viewWorld') {
      return sideMenuItems.find((i) => i.id === activeMenuId)?.iconName;
    }
    return undefined;
  }, [activeMenuId]);

  if (!world2dStore?.worldDetails?.world) {
    return <></>;
  }

  const {world} = world2dStore.worldDetails;

  return (
    <styled.Container data-testid="WorldProfileWidget-test">
      {world2dStore.isCurrentUserWorldAdmin && (
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
          size={activeMenuId === 'editMembers' ? 'large' : 'normal'}
          variant="primary"
          icon={panelIcon}
          title={t('labels.odysseyOverview')}
          image={!panelIcon ? getImageAbsoluteUrl(world?.avatarHash, ImageSizeEnum.S3) : null}
          onClose={() => widgetManagerStore.close(WidgetEnum.WORLD_PROFILE)}
        >
          <styled.Wrapper>
            {activeMenuId === 'viewWorld' && (
              <WorldView world={world} onSelectUser={onSelectUser} onStakeWorld={onStakeWorld} />
            )}

            {activeMenuId === 'editMembers' && <WorldMembers />}
          </styled.Wrapper>
        </Panel>
      </styled.PanelContainer>
    </styled.Container>
  );
};

export default observer(WorldProfileWidget);
