import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath, useNavigate} from 'react-router-dom';
import {Menu, MenuItemInterface, PositionEnum} from '@momentum-xyz/ui-kit-storybook';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';
import {WidgetEnum} from 'core/enums';

import * as styled from './WidgetMenuPage.styled';

interface MenuItemExtendedInterface extends MenuItemInterface<WidgetEnum> {
  isHidden?: boolean;
}

interface PropsInterface {
  isWorld?: boolean;
}

const WidgetMenuPage: FC<PropsInterface> = ({isWorld}) => {
  const {sessionStore, widgetManagerStore, universeStore} = useStore();
  const {toggle, activeWidgetList} = widgetManagerStore;
  const {isGuest, userImageUrl} = sessionStore;
  const {worldId, isMyWorld} = universeStore;

  const navigate = useNavigate();

  const MENU_ITEMS: MenuItemExtendedInterface[] = [
    {
      key: WidgetEnum.GO_TO,
      position: PositionEnum.LEFT,
      iconName: 'go',
      isHidden: !isWorld,
      onClick: () => navigate(ROUTES.explore)
    },
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
      key: WidgetEnum.STAKING,
      position: PositionEnum.CENTER,
      iconName: 'stake',
      onClick: toggle,
      isHidden: !isWorld || isGuest
    },
    {
      key: WidgetEnum.GO_TO,
      position: PositionEnum.CENTER,
      iconName: 'pencil',
      isHidden: !isWorld || !isMyWorld,
      onClick: () => navigate(generatePath(ROUTES.odyssey.creator.base, {worldId}))
    },
    {
      key: WidgetEnum.UNIVERSE_INFO,
      position: PositionEnum.RIGHT,
      iconName: 'alert',
      onClick: toggle,
      isHidden: isWorld
    },
    {
      key: WidgetEnum.VOICE_CHAT,
      position: PositionEnum.RIGHT,
      iconName: 'group_chat',
      onClick: toggle,
      isHidden: !isWorld
    },
    {
      key: WidgetEnum.WORLD_PEOPLE,
      position: PositionEnum.RIGHT,
      iconName: 'group',
      onClick: toggle,
      isHidden: !isWorld
    },
    {
      key: WidgetEnum.WORLD_PROFILE,
      position: PositionEnum.RIGHT,
      iconName: 'planet', // FIXME: World image
      onClick: toggle,
      isHidden: !isWorld
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
