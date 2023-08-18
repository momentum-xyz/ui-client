import {observer} from 'mobx-react-lite';
import {FC, useCallback, useEffect} from 'react';
import {Panel, IconNameType, SideMenuItemInterface, SideMenu, Dialog} from '@momentum-xyz/ui-kit';
import {i18n, useI18n} from '@momentum-xyz/core';
import {toast} from 'react-toastify';

import {ToastContent} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {CreatorTabsEnum} from 'core/enums';
import {subMenuKeyWidgetEnumMap} from 'core/constants';

import * as styled from './CreatorWidget.styled';
import {
  WorldEditor,
  SpawnAsset,
  SkyboxSelector,
  ObjectInspector,
  AssetCustomising,
  ObjectFunction,
  MusicManager,
  SceneExplorer,
  WorldMembers
} from './pages';

type MenuItemType = keyof typeof CreatorTabsEnum;

const sideMenuItems: SideMenuItemInterface<MenuItemType>[] = [
  {
    id: 'editWorld',
    iconName: 'rabbit_fill',
    label: i18n.t('actions.editProfile')
  },
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
    label: i18n.t('labels.soundtrack')
  },
  {
    id: 'sceneExplorer',
    iconName: 'cubicles',
    label: i18n.t('labels.sceneExplorer')
  },
  {
    id: 'editMembers',
    iconName: 'collaboration',
    label: i18n.t('labels.coCreators')
  }
];

const allPanels: SideMenuItemInterface<MenuItemType>[] = [
  ...sideMenuItems,
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
  const {world2dStore, world3dStore, worldId} = universeStore;
  const {creatorStore} = widgetStore;

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

  const panel = allPanels.find((panel) => panel.id === selectedTab);
  const menuItem = sideMenuItems.find((item) => item.id === selectedTab);

  const handleSubMenuActiveChange = useCallback(
    (tab: keyof typeof CreatorTabsEnum | null): void => {
      const currentTabIsOnSubMenu = selectedTab && subMenuKeyWidgetEnumMap[selectedTab];
      const correspondingSubMenuWidget = tab && subMenuKeyWidgetEnumMap[tab];

      if (correspondingSubMenuWidget) {
        widgetManagerStore.setSubMenuActiveKeys([correspondingSubMenuWidget]);
      } else if (currentTabIsOnSubMenu) {
        widgetManagerStore.setSubMenuActiveKeys([]);
      }
    },
    [selectedTab, widgetManagerStore]
  );

  const handleTabChange = useCallback(
    (tab?: keyof typeof CreatorTabsEnum): void => {
      setSelectedTab(tab || null);
      handleSubMenuActiveChange(tab || null);
    },
    [handleSubMenuActiveChange, setSelectedTab]
  );

  const content = (() => {
    if (!world2dStore?.worldDetails?.world) {
      return <></>;
    }

    const {world} = world2dStore.worldDetails;

    switch (selectedTab) {
      case 'editWorld':
        return <WorldEditor world={world} onCancel={() => handleTabChange(undefined)} />;
      case 'addObject':
        return <SpawnAsset />;
      case 'skybox':
        return <SkyboxSelector />;
      case 'sound':
        return <MusicManager />;
      case 'inspector':
        return world3dStore?.selectedObjectId ? (
          <ObjectInspector
            objectId={world3dStore.selectedObjectId}
            key={world3dStore.selectedObjectId}
          />
        ) : null;
      case 'functionality':
        return <ObjectFunction />;
      case 'customise':
        return <AssetCustomising />;
      case 'sceneExplorer':
        return world3dStore ? <SceneExplorer world3dStore={world3dStore} /> : null;
      case 'editMembers':
        return <WorldMembers />;
      // case 'spawnPoint':
      //   return <SpawnPointPage />;
      default:
    }
    return null;
  })();

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
          size={
            ['editWorld', 'sound', 'functionality', 'sceneExplorer'].includes(selectedTab)
              ? 'normal'
              : 'large'
          }
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
