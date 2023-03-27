import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Menu, MenuItemInterface} from '@momentum-xyz/ui-kit-storybook';

import {useStore} from 'shared/hooks';
import {WidgetType} from 'core/types';

import * as styled from './MainMenuPage.styled';

const MainMenuPage: FC = () => {
  const {sessionStore} = useStore();
  const {userImageUrl, isGuest} = sessionStore;

  const [activeKey, setActiveKey] = useState<WidgetType>();

  const CENTER_ITEMS: MenuItemInterface<WidgetType>[] = [{key: 'UNIVERSE', iconName: 'info_2'}];

  const LEFT_ITEMS: MenuItemInterface<WidgetType>[] = [
    {key: 'MAIN_MENU', iconName: 'menu_info'},
    {key: 'PROFILE', imageSrc: userImageUrl},
    {key: 'RABBIT', iconName: 'rabbit_fill'},
    {key: 'EMOJI', iconName: 'smiley-face'}
  ];

  return (
    <styled.Container data-testid="MainMenuPage-test">
      <Menu
        leftItems={!isGuest ? LEFT_ITEMS : []}
        centerItems={CENTER_ITEMS}
        activeKey={activeKey}
        onChangeActiveKey={(key) => {
          setActiveKey(key);
        }}
      />
    </styled.Container>
  );
};

export default observer(MainMenuPage);
