import {observer} from 'mobx-react-lite';
import {FC, useEffect, useMemo} from 'react';
import {Panel, IconNameType, SideMenuItemInterface, SideMenu} from '@momentum-xyz/ui-kit-storybook';
import {i18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';

import {ObjectMenu} from './components';
import * as styled from './OdysseyCreator.styled';
import {SpawnAssetPage} from './pages/SpawnAssetPage';
import {SkyboxSelectorWithPreviewPage} from './pages/SkyboxSelectorWithPreviewPage';

export enum TabsEnum {
  addObject = 'addObject',
  skybox = 'skybox',
  spawnPoint = 'spawnPoint',
  spawnAsset = 'spawnAsset',
  functionality = 'functionality',
  objectColor = 'objectColor'
}

type MenuItemType = keyof typeof TabsEnum;

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
  }
];
const allPanels = [
  ...sideMenuItems,
  {
    id: 'inspector',
    iconName: 'inspector',
    label: i18n.t('labels.inspector')
  }
];

const OdysseyCreator: FC = () => {
  const {universeStore} = useStore();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const world3dStore = universeStore.world3dStore!;
  const {selectedCreatorTab, setSelectedCreatorTab} = world3dStore;

  useEffect(() => {
    world3dStore.enableCreatorMode();
    return () => {
      world3dStore.disableCreatorMode();
    };
  }, [world3dStore]);

  const content =
    useMemo(() => {
      switch (selectedCreatorTab) {
        case 'addObject':
          return <SpawnAssetPage />;
        case 'skybox':
          return <SkyboxSelectorWithPreviewPage />;
        case 'inspector':
          return <ObjectMenu />;
        default:
      }
      return null;
    }, [selectedCreatorTab]) || [];

  const panel = allPanels.find((panel) => panel.id === selectedCreatorTab);
  const menuItem = sideMenuItems.find((item) => item.id === selectedCreatorTab);

  return (
    <styled.Container>
      <SideMenu
        activeId={menuItem?.id}
        orientation="left"
        sideMenuItems={sideMenuItems}
        onSelect={world3dStore.setSelectedCreatorTab}
      />

      {!!selectedCreatorTab && (
        <Panel
          isFullHeight
          size="large"
          variant="primary"
          title={panel?.label || ''}
          icon={panel?.iconName as IconNameType}
          onClose={() => {
            setSelectedCreatorTab(null);
          }}
        >
          {content}
        </Panel>
      )}
      {world3dStore.objectMenu.isOpen && <ObjectMenu />}
    </styled.Container>
  );
};

export default observer(OdysseyCreator);
