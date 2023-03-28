import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Menu, MenuItemInterface, MenuItemPositionEnum} from '@momentum-xyz/ui-kit-storybook';

import {useStore} from 'shared/hooks';
import {WidgetTypeEnum} from 'core/enums';

import * as styled from './WidgetMenuPage.styled';

const WidgetMenuPage: FC = () => {
  const {sessionStore, widgetManagerStore} = useStore();
  const {toggle, activeType} = widgetManagerStore;
  const {isGuest, userImageUrl} = sessionStore;

  const MENU_ITEMS_GUEST: MenuItemInterface<WidgetTypeEnum>[] = [
    {
      key: WidgetTypeEnum.UNIVERSE,
      position: MenuItemPositionEnum.CENTER,
      iconName: 'info_2',
      onClick: toggle
    }
  ];

  const MENU_ITEMS: MenuItemInterface<WidgetTypeEnum>[] = [
    {
      key: WidgetTypeEnum.UNIVERSE,
      position: MenuItemPositionEnum.CENTER,
      iconName: 'info_2',
      onClick: toggle
    },
    {
      key: WidgetTypeEnum.MAIN_MENU,
      position: MenuItemPositionEnum.LEFT,
      iconName: 'menu_info',
      onClick: toggle
    },
    {
      key: WidgetTypeEnum.PROFILE,
      position: MenuItemPositionEnum.LEFT,
      imageSrc: userImageUrl,
      onClick: toggle
    },
    {
      key: WidgetTypeEnum.RABBIT,
      position: MenuItemPositionEnum.LEFT,
      iconName: 'rabbit_fill',
      onClick: toggle
    },
    {
      key: WidgetTypeEnum.EMOJI,
      position: MenuItemPositionEnum.LEFT,
      iconName: 'smiley-face',
      onClick: toggle
    },
    {
      key: WidgetTypeEnum.EXPLORE,
      position: MenuItemPositionEnum.RIGHT,
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
