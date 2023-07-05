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
import {WorldFormInterface} from 'core/interfaces';

import {WorldEditor, WorldMembers, WorldView} from './components';
import * as styled from './WorldProfileWidget.styled';

type MenuItemType = 'viewWorld' | 'editWorld' | 'editMembers';

const adminMenuItems: SideMenuItemInterface<MenuItemType>[] = [
  {
    id: 'editWorld',
    iconName: 'edit',
    label: i18n.t('actions.edit')
  }
];

const ownerSideMenuItems: SideMenuItemInterface<MenuItemType>[] = [
  ...adminMenuItems,
  {
    id: 'editMembers',
    iconName: 'collaboration',
    label: i18n.t('labels.coCreators')
  }
];

const WorldProfileWidget: FC = () => {
  const {sessionStore, widgetManagerStore, universeStore, widgetStore} = useStore();
  const {worldProfileStore} = widgetStore;
  const {world2dStore, isMyWorld} = universeStore;

  const sideMenuItems = isMyWorld ? ownerSideMenuItems : adminMenuItems;

  const [activeMenuId, setActiveMenuId] = useState<MenuItemType>('viewWorld');

  const {t} = useI18n();

  const onSelectUser = (userId: string) => {
    widgetManagerStore.open(WidgetEnum.USER_DETAILS, PositionEnum.LEFT, {id: userId});
  };

  const onStakeWorld = () => {
    widgetManagerStore.open(WidgetEnum.STAKING, PositionEnum.RIGHT);
  };

  const onEditWorld = async (form: WorldFormInterface, previousImageHash?: string | null) => {
    if (!world2dStore?.worldDetails?.world) {
      return;
    }
    const {worldDetails, worldId} = world2dStore;
    if (await worldProfileStore.editWorld(worldId, form, previousImageHash || undefined)) {
      await worldDetails.fetchWorld();
      await sessionStore.loadOwnWorlds();
      await sessionStore.loadStakedWorlds();
      await universeStore.universe2dStore.loadWorlds();
      setActiveMenuId('viewWorld');
    }
  };

  const panelIcon = useMemo(() => {
    if (activeMenuId !== 'viewWorld') {
      return sideMenuItems.find((i) => i.id === activeMenuId)?.iconName;
    }
    return undefined;
  }, [activeMenuId, sideMenuItems]);

  if (!world2dStore?.worldDetails?.world) {
    return <></>;
  }

  const {world} = world2dStore.worldDetails;

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

            {activeMenuId === 'editWorld' && (
              <WorldEditor
                world={world}
                isUpdating={worldProfileStore.isUpdating}
                formErrors={worldProfileStore.formErrors}
                onSelectUser={onSelectUser}
                onEditWorld={onEditWorld}
                onCancel={() => setActiveMenuId('viewWorld')}
              />
            )}

            {activeMenuId === 'editMembers' && <WorldMembers />}
          </styled.Wrapper>
        </Panel>
      </styled.PanelContainer>
    </styled.Container>
  );
};

export default observer(WorldProfileWidget);
