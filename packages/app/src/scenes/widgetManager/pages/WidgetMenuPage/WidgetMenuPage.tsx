import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Menu, MenuItemInterface, PositionEnum} from '@momentum-xyz/ui-kit-storybook';

import {useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';

import * as styled from './WidgetMenuPage.styled';

interface MenuItemExtendedInterface extends MenuItemInterface<WidgetEnum> {
  isHidden?: boolean;
}

interface PropsInterface {
  isWorld?: boolean;
}

const WidgetMenuPage: FC<PropsInterface> = ({isWorld}) => {
  const {sessionStore, widgetManagerStore} = useStore();
  const {toggle, activeWidgetList} = widgetManagerStore;
  const {isGuest, userImageUrl} = sessionStore;

  const MENU_ITEMS: MenuItemExtendedInterface[] = [
    {
      key: WidgetEnum.EXPLORE,
      position: PositionEnum.LEFT,
      iconName: 'explore',
      onClick: toggle
    },
    {
      key: WidgetEnum.PROFILE,
      position: PositionEnum.LEFT,
      imageSrc: userImageUrl,
      isHidden: isGuest,
      onClick: toggle
    },
    {
      key: WidgetEnum.LOGIN,
      position: PositionEnum.LEFT,
      iconName: 'astronaut',
      isHidden: !isGuest,
      onClick: toggle
    },
    {
      key: WidgetEnum.STAKING_OVERVIEW,
      position: PositionEnum.LEFT,
      iconName: 'status-2',
      isHidden: isGuest,
      onClick: toggle
    },
    {
      key: WidgetEnum.UNIVERSE_INFO,
      position: PositionEnum.RIGHT,
      iconName: 'alert',
      onClick: toggle
    }
  ];

  return (
    <styled.Container data-testid="WidgetMenuPage-test">
      <Menu
        activeKeys={activeWidgetList}
        items={MENU_ITEMS.filter((menuItem) => !menuItem.isHidden)}
      />
    </styled.Container>
  );
};

export default observer(WidgetMenuPage);
