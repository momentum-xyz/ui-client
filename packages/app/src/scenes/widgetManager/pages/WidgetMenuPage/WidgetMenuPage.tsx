import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Menu, MenuItemInterface, PositionEnum} from '@momentum-xyz/ui-kit-storybook';

import {useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';

import * as styled from './WidgetMenuPage.styled';

const WidgetMenuPage: FC = () => {
  const {sessionStore, widgetManagerStore} = useStore();
  const {toggle, activeType} = widgetManagerStore;
  const {isGuest, userImageUrl} = sessionStore;

  const MENU_ITEMS_GUEST: MenuItemInterface<WidgetEnum>[] = [
    {
      key: WidgetEnum.UNIVERSE,
      position: PositionEnum.CENTER,
      iconName: 'info_2',
      onClick: toggle
    }
  ];

  const MENU_ITEMS: MenuItemInterface<WidgetEnum>[] = [
    {
      key: WidgetEnum.UNIVERSE,
      position: PositionEnum.CENTER,
      iconName: 'info_2',
      onClick: toggle
    },
    {
      key: WidgetEnum.MAIN_MENU,
      position: PositionEnum.LEFT,
      iconName: 'menu_info',
      onClick: toggle
    },
    {
      key: WidgetEnum.PROFILE,
      position: PositionEnum.LEFT,
      imageSrc: userImageUrl,
      onClick: toggle
    },
    {
      key: WidgetEnum.RABBIT,
      position: PositionEnum.LEFT,
      iconName: 'rabbit_fill',
      onClick: toggle
    },
    {
      key: WidgetEnum.EMOJI,
      position: PositionEnum.LEFT,
      iconName: 'smiley-face',
      onClick: toggle
    },
    {
      key: WidgetEnum.EXPLORE,
      position: PositionEnum.RIGHT,
      iconName: 'planet',
      onClick: toggle
    }
  ];

  return (
    <styled.Container data-testid="WidgetMenuPage-test">
      <Menu items={isGuest ? MENU_ITEMS_GUEST : MENU_ITEMS} activeKey={activeType} />
    </styled.Container>
  );
};

export default observer(WidgetMenuPage);
