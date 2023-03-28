import {FC, useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import {Menu, MenuItemInterface, MenuItemPositionEnum} from '@momentum-xyz/ui-kit-storybook';

import {useStore} from 'shared/hooks';
import {WidgetTypeEnum} from 'core/enums';

import * as styled from './WidgetMenuPage.styled';

const WidgetMenuPage: FC = () => {
  const {sessionStore, widgetManagerStore} = useStore();
  const {userImageUrl} = sessionStore;

  const openOrClose = useCallback(
    (type: WidgetTypeEnum, position: MenuItemPositionEnum) => {
      if (type && widgetManagerStore.activeType !== type) {
        widgetManagerStore.open(type, position);
      } else {
        widgetManagerStore.close(type);
      }
    },
    [widgetManagerStore]
  );

  const MENU_ITEMS: MenuItemInterface<WidgetTypeEnum>[] = [
    {
      iconName: 'info_2',
      key: WidgetTypeEnum.UNIVERSE,
      position: MenuItemPositionEnum.CENTER,
      onClick: (type) => openOrClose(type, MenuItemPositionEnum.CENTER)
    },
    {
      key: WidgetTypeEnum.MAIN_MENU,
      position: MenuItemPositionEnum.LEFT,
      iconName: 'menu_info',
      onClick: (type) => openOrClose(type, MenuItemPositionEnum.LEFT)
    },
    {
      key: WidgetTypeEnum.PROFILE,
      position: MenuItemPositionEnum.LEFT,
      imageSrc: userImageUrl,
      onClick: (type) => openOrClose(type, MenuItemPositionEnum.LEFT)
    },
    {
      key: WidgetTypeEnum.RABBIT,
      position: MenuItemPositionEnum.LEFT,
      iconName: 'rabbit_fill',
      onClick: (type) => openOrClose(type, MenuItemPositionEnum.LEFT)
    },
    {
      key: WidgetTypeEnum.EMOJI,
      position: MenuItemPositionEnum.LEFT,
      iconName: 'smiley-face',
      onClick: (type) => openOrClose(type, MenuItemPositionEnum.LEFT)
    }
  ];

  return (
    <styled.Container data-testid="WidgetMenuPage-test">
      <Menu items={MENU_ITEMS} activeKey={widgetManagerStore.activeType} />
    </styled.Container>
  );
};

export default observer(WidgetMenuPage);
