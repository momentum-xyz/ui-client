import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath, useNavigate} from 'react-router-dom';
import {Menu, MenuItemInterface, PositionEnum} from '@momentum-xyz/ui-kit-storybook';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';
import {WidgetEnum} from 'core/enums';
import {getImageAbsoluteUrl} from 'core/utils';

import * as styled from './WidgetMenuPage.styled';

interface MenuItemExtendedInterface extends MenuItemInterface<WidgetEnum> {
  isHidden?: boolean;
}

interface PropsInterface {
  isWorld?: boolean;
}

const WidgetMenuPage: FC<PropsInterface> = ({isWorld}) => {
  const {sessionStore, widgetManagerStore, universeStore, agoraStore} = useStore();
  const {toggle, activeWidgetList} = widgetManagerStore;
  const {isGuest, userImageUrl} = sessionStore;
  const {isMyWorld, world3dStore, world2dStore} = universeStore;

  const navigate = useNavigate();

  const ODYSSEY_ITEMS: MenuItemExtendedInterface[] = sessionStore.worldsOwnedList.map((world) => ({
    key: WidgetEnum.GO_TO,
    position: PositionEnum.LEFT,
    iconName: !world.avatarHash ? 'rabbit_fill' : undefined,
    image: getImageAbsoluteUrl(world.avatarHash) || undefined,
    isHidden: isWorld,
    onClick: () => navigate(generatePath(ROUTES.odyssey.base, {worldId: world.id}))
  }));

  const MENU_ITEMS: MenuItemExtendedInterface[] = [
    {
      key: WidgetEnum.EXPLORE,
      position: PositionEnum.LEFT,
      iconName: 'explore',
      isHidden: isWorld,
      onClick: toggle
    },
    {
      key: WidgetEnum.GO_TO,
      position: PositionEnum.LEFT,
      iconName: 'explore',
      isHidden: !isWorld,
      onClick: () => navigate(ROUTES.explore)
    },
    {
      key: WidgetEnum.MY_PROFILE,
      position: PositionEnum.LEFT,
      imageSrc: userImageUrl,
      iconIndicator: agoraStore.hasJoined ? 'voice' : undefined,
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
      key: WidgetEnum.STAKING_VIEW,
      position: PositionEnum.LEFT,
      iconName: 'status-2',
      isHidden: isGuest,
      onClick: toggle
    },
    ...ODYSSEY_ITEMS,
    {
      key: WidgetEnum.STAKING,
      position: PositionEnum.CENTER,
      viewPosition: PositionEnum.RIGHT,
      iconName: 'stake',
      onClick: toggle,
      isHidden: !isWorld || isGuest
    },
    {
      key: WidgetEnum.CREATOR,
      position: PositionEnum.CENTER,
      viewPosition: PositionEnum.RIGHT,
      iconName: 'pencil',
      isHidden: !isWorld || !isMyWorld,
      onClick: toggle
    },
    {
      key: WidgetEnum.GO_TO,
      position: PositionEnum.CENTER, // TODO 2nd floor
      iconName: 'checked',
      onClick: () => world3dStore?.setAttachedToCamera(null),
      isHidden: !world3dStore?.attachedToCameraObjectId
    },
    {
      key: WidgetEnum.VOICE_CHAT,
      position: PositionEnum.RIGHT,
      iconName: 'voice_chat',
      iconIndicator:
        agoraStore.hasJoined && !activeWidgetList.includes(WidgetEnum.VOICE_CHAT)
          ? 'voice'
          : undefined,
      onClick: toggle,
      isHidden: !isWorld
    },
    {
      key: WidgetEnum.WORLD_VISITORS,
      position: PositionEnum.RIGHT,
      iconName: 'group',
      onClick: toggle,
      isHidden: !isWorld
    },
    {
      key: WidgetEnum.WORLD_PROFILE,
      position: PositionEnum.RIGHT,
      iconName: 'rabbit_fill',
      imageSrc: world2dStore?.imageSrc,
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
