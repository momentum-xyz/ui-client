import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Menu, MenuItemInterface} from '@momentum-xyz/ui-kit-storybook';

import {useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';

import * as styled from './WidgetMenuPage.styled';

const WidgetMenuPage: FC = () => {
  const {sessionStore} = useStore();
  const {userImageUrl, isGuest} = sessionStore;

  const [activeKey, setActiveKey] = useState<WidgetEnum>();

  const CENTER_ITEMS: MenuItemInterface<WidgetEnum>[] = [
    {key: WidgetEnum.UNIVERSE, iconName: 'info_2'}
  ];

  const LEFT_ITEMS: MenuItemInterface<WidgetEnum>[] = [
    {key: WidgetEnum.MAIN_MENU, iconName: 'menu_info'},
    {key: WidgetEnum.PROFILE, imageSrc: userImageUrl},
    {key: WidgetEnum.RABBIT, iconName: 'rabbit_fill'},
    {key: WidgetEnum.EMOJI, iconName: 'smiley-face'}
  ];

  return (
    <styled.Container data-testid="WidgetMenuPage-test">
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

export default observer(WidgetMenuPage);
