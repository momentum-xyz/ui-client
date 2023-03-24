import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Menu, MenuItemInterface} from '@momentum-xyz/ui-kit-storybook';

import {useStore} from 'shared/hooks';

import * as styled from './UniverseMenuPage.styled';

type MenuItemType = 'MAIN_MENU' | 'PROFILE' | 'RABBIT' | 'EMOJI' | 'UNIVERSE';

const UniverseMenuPage: FC = () => {
  const {sessionStore} = useStore();
  const {userImageUrl} = sessionStore;

  const [activeKey, setActiveKey] = useState<MenuItemType>();

  const CENTER_ITEMS: MenuItemInterface<MenuItemType>[] = [{key: 'UNIVERSE', iconName: 'info_2'}];

  const LEFT_ITEMS: MenuItemInterface<MenuItemType>[] = [
    {key: 'MAIN_MENU', iconName: 'menu_info'},
    {key: 'PROFILE', imageSrc: userImageUrl},
    {key: 'RABBIT', iconName: 'rabbit_fill'},
    {key: 'EMOJI', iconName: 'smiley-face'}
  ];

  return (
    <styled.Container data-testid="UniverseMenuPage-test">
      <Menu
        leftItems={LEFT_ITEMS}
        centerItems={CENTER_ITEMS}
        activeKey={activeKey}
        onChangeActiveKey={(key) => {
          setActiveKey(key);
        }}
      />
    </styled.Container>
  );
};

export default observer(UniverseMenuPage);
