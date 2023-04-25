import {observer} from 'mobx-react-lite';
import {FC, useEffect, useMemo} from 'react';
import {Panel, IconNameType, SideMenuItemInterface, SideMenu} from '@momentum-xyz/ui-kit-storybook';
import {i18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';
import {CreatorTabsEnum} from 'core/enums';

import * as styled from './OdysseyCreator.styled';
import {
  SpawnAssetPage,
  SkyboxSelectorWithPreviewPage,
  ObjectInspectorPage,
  AssetCustomisingPage,
  ObjectFunctionalityPage
} from './pages';

type MenuItemType = keyof typeof CreatorTabsEnum;

const sideMenuItems: SideMenuItemInterface<MenuItemType>[] = [
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
  // TODO move to all panels
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
const allPanels: SideMenuItemInterface<MenuItemType>[] = [
  ...sideMenuItems,
  {
    id: 'inspector',
    iconName: 'info',
    label: i18n.t('labels.inspector')
  }
];

const OdysseyCreator: FC = () => {
  const {universeStore, creatorStore} = useStore();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const world3dStore = universeStore.world3dStore!;
  const worldId = universeStore.worldId;

  const {selectedTab, setSelectedTab, spawnAssetStore} = creatorStore;

  useEffect(() => {
    world3dStore.enableCreatorMode();
    spawnAssetStore.init(worldId); // TEMP
    spawnAssetStore.fetchAllAssets3d(); // TEMP
    return () => {
      world3dStore.disableCreatorMode();
      creatorStore.reset();
    };
  }, [creatorStore, world3dStore, spawnAssetStore, worldId]);

  const content =
    useMemo(() => {
      switch (selectedTab) {
        case 'addObject':
          return <SpawnAssetPage />;
        case 'skybox':
          return <SkyboxSelectorWithPreviewPage />;
        case 'inspector':
          return <ObjectInspectorPage />;
        case 'functionality':
          return <ObjectFunctionalityPage />;
        case 'customise':
          return <AssetCustomisingPage />;
        // case 'spawnPoint':
        //   return <SpawnPointPage />;
        default:
      }
      return null;
    }, [selectedTab]) || [];

  const panel = allPanels.find((panel) => panel.id === selectedTab);
  const menuItem = sideMenuItems.find((item) => item.id === selectedTab);

  return (
    <styled.Container>
      <SideMenu
        activeId={menuItem?.id}
        orientation="left"
        // sideMenuItems={sideMenuItems}
        sideMenuItems={allPanels} // TEMP
        onSelect={setSelectedTab}
      />

      {!!selectedTab && (
        <Panel
          isFullHeight
          size="large"
          variant="primary"
          title={panel?.label || ''}
          icon={panel?.iconName as IconNameType}
          onClose={() => {
            setSelectedTab(null);
          }}
        >
          {content}
        </Panel>
      )}
    </styled.Container>
  );
};

export default observer(OdysseyCreator);
