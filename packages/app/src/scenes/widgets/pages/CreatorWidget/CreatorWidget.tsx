import {observer} from 'mobx-react-lite';
import {FC, useCallback, useEffect, useState} from 'react';
import {Dialog, IconNameType, Panel, SideMenu, SideMenuItemInterface} from '@momentum-xyz/ui-kit';
import {UsePluginHookReturnInterface} from '@momentum-xyz/sdk';
import {i18n, useI18n} from '@momentum-xyz/core';
import {toast} from 'react-toastify';

import {ToastContent} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {FeatureFlagEnum} from 'api/enums';
import {CreatorTabsEnum} from 'core/enums';
import {isFeatureEnabled} from 'api/constants';
import {subMenuKeyWidgetEnumMap} from 'core/constants';
import {PluginLoaderModelType} from 'core/models';

import * as styled from './CreatorWidget.styled';
import {
  CanvasEditor,
  MusicManager,
  ObjectInspector,
  SceneExplorer,
  SkyboxSelector,
  SpawnAsset,
  WorldEditor,
  WorldMembers,
  PluginHolder
} from './pages';

type MenuItemType = keyof typeof CreatorTabsEnum; // | string;

const SIZE_MENU_ITEMS: SideMenuItemInterface<MenuItemType>[] = [
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
    id: 'canvas',
    iconName: 'idea',
    label: i18n.t('labels.canvasEditor')
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

const ALL_MENU_ITEMS: SideMenuItemInterface<MenuItemType>[] = [
  ...SIZE_MENU_ITEMS,
  {
    id: 'inspector',
    iconName: 'info',
    label: i18n.t('labels.inspector')
  }
];

const CreatorWidget: FC = () => {
  const {universeStore, widgetStore, widgetManagerStore, pluginStore} = useStore();
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

  const [pluginsCreatorTabData, setPluginsCreatorTabData] = useState<
    Record<
      string,
      {
        pluginLoader: PluginLoaderModelType;
        creatorTab: UsePluginHookReturnInterface['creatorTab'];
      }
    >
  >({});

  useEffect(() => {
    pluginStore.preloadPluginsByScope('creatorTab');
  }, [pluginStore]);

  console.log('pluginsByScope', pluginStore.pluginsByScope('creatorTab'));
  const pluginLoaders = pluginStore.pluginsByScope('creatorTab');
  const pluginHolders = pluginLoaders.map((pluginLoader, idx) => {
    return (
      <PluginHolder
        key={pluginLoader.id}
        failSilently
        pluginLoader={pluginLoader}
        onCreatorTabChanged={(data) => {
          console.log('onCreatorTabChanged:', data);
          if (data) {
            setPluginsCreatorTabData((prev) => {
              const next = {...prev, [pluginLoader.id]: {pluginLoader, creatorTab: data}};
              return next;
            });
          }
        }}
      />
    );
  });

  useEffect(() => {
    world3dStore?.enableCreatorMode();
    spawnAssetStore.init(worldId); // TEMP
    spawnAssetStore.fetchAllAssets3d(); // TEMP

    return () => {
      world3dStore?.disableCreatorMode();
      creatorStore.resetModel();
    };
  }, [creatorStore, world3dStore, spawnAssetStore, worldId]);

  const panel = ALL_MENU_ITEMS.find((panel) => panel.id === selectedTab);
  const menuItem = SIZE_MENU_ITEMS.find((item) => item.id === selectedTab);

  const enabledSideMenuItems = !isFeatureEnabled(FeatureFlagEnum.CANVAS)
    ? SIZE_MENU_ITEMS.filter((item) => item.id !== 'canvas')
    : SIZE_MENU_ITEMS;

  const sideMenuItems = enabledSideMenuItems.concat(
    Object.values(pluginsCreatorTabData).map(({pluginLoader, creatorTab}) => ({
      id: pluginLoader.id,
      iconName: creatorTab?.icon || 'rabbit_fill',
      label: creatorTab?.title || pluginLoader.name
    })) as any
  );

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
      case 'canvas':
        return <CanvasEditor onClose={() => handleTabChange(undefined)} />;
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
      case 'sceneExplorer':
        return world3dStore ? <SceneExplorer world3dStore={world3dStore} /> : null;
      case 'editMembers':
        return <WorldMembers />;
      default:
        if (selectedTab && pluginsCreatorTabData[selectedTab]) {
          const {creatorTab} = pluginsCreatorTabData[selectedTab];
          return creatorTab?.content || null;
        }
    }
    return null;
  })();

  return (
    <styled.Container data-testid="CreatorWidget-test">
      <div>
        <SideMenu
          orientation="left"
          activeId={menuItem?.id}
          sideMenuItems={sideMenuItems as any}
          onSelect={handleTabChange}
        />
      </div>

      {/* TODO: Add the Panel to each component */}
      {!!selectedTab && !!content && selectedTab !== 'canvas' && (
        <Panel
          isFullHeight
          size={
            ['editWorld', 'sound', 'functionality', 'sceneExplorer'].includes(selectedTab)
              ? 'normal'
              : 'large'
          }
          variant="primary"
          title={panel?.label || pluginsCreatorTabData[selectedTab]?.creatorTab?.title || ''}
          icon={
            (panel?.iconName ||
              pluginsCreatorTabData[selectedTab]?.creatorTab?.icon) as IconNameType
          }
          onClose={() => handleTabChange()}
        >
          {content}
        </Panel>
      )}

      {!!selectedTab && !!content && selectedTab === 'canvas' && <>{content}</>}

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
                  world3dStore?.fetchCanvasObject();
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

      {pluginHolders}
    </styled.Container>
  );
};

export default observer(CreatorWidget);
