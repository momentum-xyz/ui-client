import {observer} from 'mobx-react-lite';
import {FC, useEffect, useMemo} from 'react';
import {Panel, IconNameType, SideMenuItemInterface, SideMenu, Dialog} from '@momentum-xyz/ui-kit';
import {i18n, useI18n} from '@momentum-xyz/core';
import {toast} from 'react-toastify';

import {ToastContent} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {CreatorTabsEnum} from 'core/enums';
import {subMenuKeyWidgetEnumMap} from 'core/constants';

import * as styled from './CreatorWidget.styled';
import {
  SpawnAsset,
  SkyboxSelector,
  ObjectInspector,
  AssetCustomising,
  ObjectFunction,
  MusicManager,
  Admins
} from './pages';

type MenuItemType = keyof typeof CreatorTabsEnum;

const adminMenuItems: SideMenuItemInterface<MenuItemType>[] = [
  {
    id: 'addObject',
    iconName: 'add',
    label: i18n.t('labels.addObject')
  },
  {
    id: 'skybox',
    iconName: 'skybox',
    label: i18n.t('labels.skyboxes')
  },
  {
    id: 'sound',
    iconName: 'music',
    label: i18n.t('labels.sound')
  }
];
const ownerSideMenuItems: SideMenuItemInterface<MenuItemType>[] = [
  ...adminMenuItems,
  {
    id: 'admins',
    iconName: 'collaboration',
    label: i18n.t('labels.coCreators')
  }
];

const allPanels: SideMenuItemInterface<MenuItemType>[] = [
  ...ownerSideMenuItems,
  {
    id: 'inspector',
    iconName: 'info',
    label: i18n.t('labels.inspector')
  },
  {
    id: 'functionality',
    iconName: 'cubicles',
    label: i18n.t('labels.selectFunction')
  },
  {
    id: 'customise',
    iconName: 'group',
    label: i18n.t('labels.assetCustomising')
  }
];

const CreatorWidget: FC = () => {
  const {universeStore, widgetStore, widgetManagerStore} = useStore();
  const {creatorStore} = widgetStore;
  const world3dStore = universeStore.world3dStore;
  const isMyWorld = universeStore.isMyWorld;
  const worldId = universeStore.worldId;

  const sideMenuItems = isMyWorld ? ownerSideMenuItems : adminMenuItems;

  const {
    selectedTab,
    setSelectedTab,
    spawnAssetStore,
    removeObjectDialog,
    removeObject,
    objectName
  } = creatorStore;

  const {t} = useI18n();

  console.log('CreatorWidget render', {selectedTab});

  useEffect(() => {
    world3dStore?.enableCreatorMode();
    spawnAssetStore.init(worldId); // TEMP
    spawnAssetStore.fetchAllAssets3d(); // TEMP

    return () => {
      world3dStore?.disableCreatorMode();
      creatorStore.resetModel();
    };
  }, [creatorStore, world3dStore, spawnAssetStore, worldId]);

  const content = useMemo(() => {
    switch (selectedTab) {
      case 'addObject':
        return <SpawnAsset />;
      case 'admins':
        return <Admins />;
      case 'skybox':
        return <SkyboxSelector />;
      case 'sound':
        return <MusicManager />;
      case 'inspector':
        return <ObjectInspector />;
      case 'functionality':
        return <ObjectFunction />;
      case 'customise':
        return <AssetCustomising />;
      // case 'spawnPoint':
      //   return <SpawnPointPage />;
      default:
    }
    return null;
  }, [selectedTab]);

  const panel = allPanels.find((panel) => panel.id === selectedTab);
  const menuItem = sideMenuItems.find((item) => item.id === selectedTab);

  const handleSubMenuActiveChange = (tab: keyof typeof CreatorTabsEnum | null): void => {
    const currentTabIsOnSubMenu = selectedTab && subMenuKeyWidgetEnumMap[selectedTab];
    const correspondingSubMenuWidget = tab && subMenuKeyWidgetEnumMap[tab];

    if (correspondingSubMenuWidget) {
      widgetManagerStore.setSubMenuActiveKeys([correspondingSubMenuWidget]);
    } else if (currentTabIsOnSubMenu) {
      widgetManagerStore.setSubMenuActiveKeys([]);
    }
  };

  const handleTabChange = (tab?: keyof typeof CreatorTabsEnum): void => {
    setSelectedTab(tab || null);
    handleSubMenuActiveChange(tab || null);
  };

  return (
    <styled.Container data-testid="CreatorWidget-test">
      <div>
        <SideMenu
          activeId={menuItem?.id}
          orientation="left"
          sideMenuItems={sideMenuItems}
          onSelect={handleTabChange}
        />
      </div>

      {!!selectedTab && !!content && (
        <Panel
          isFullHeight
          size={['sound'].includes(selectedTab) ? 'normal' : 'large'}
          variant="primary"
          title={panel?.label || ''}
          icon={panel?.iconName as IconNameType}
          onClose={() => handleTabChange()}
        >
          {content}
        </Panel>
      )}

      {removeObjectDialog.isOpen && (
        <Dialog
          title={
            objectName ? t('messages.deleteNamedObject', {name: objectName}) : t('messages.delete')
          }
          approveInfo={{
            title: t('actions.delete'),
            onClick: () => {
              removeObject()
                .then(() => {
                  toast.info(<ToastContent icon="bin" text={t('messages.objectDeleted')} />);
                  removeObjectDialog.close();
                  widgetManagerStore.closeSubMenu();
                })
                .catch((error) => {
                  console.log('Error removing object:', error);
                  toast.error(
                    <ToastContent icon="alert" text={t('messages.errorDeletingObject')} />
                  );
                });
            }
          }}
          declineInfo={{
            title: t('actions.cancel'),
            onClick: removeObjectDialog.close
          }}
          onClose={removeObjectDialog.close}
        />
      )}
    </styled.Container>
  );
};

export default observer(CreatorWidget);
