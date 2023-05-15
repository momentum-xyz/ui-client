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
  isWelcomePage?: boolean;
}

const WidgetMenuPage: FC<PropsInterface> = ({isWorld, isWelcomePage}) => {
  const {sessionStore, widgetManagerStore, universeStore, agoraStore} = useStore();
  const {toggle, activeWidgetList, subMenuInfo} = widgetManagerStore;
  const {isGuest, userImageUrl} = sessionStore;
  const {isMyWorld, world2dStore} = universeStore;

  const navigate = useNavigate();

  const ODYSSEY_ITEMS: MenuItemExtendedInterface[] = sessionStore.worldsOwnedList.map((world) => ({
    key: WidgetEnum.GO_TO,
    position: PositionEnum.LEFT,
    iconName: 'rabbit_fill',
    imageSrc: world.imageSrc,
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
      onClick: () => {
        // TEMP we have problems when teleporting to world, then universe, then teleport again to any world
        // no messages from posbus
        window.location.href = ROUTES.explore;
      }
      // onClick: () => navigate(ROUTES.explore)
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

    // {
    //   key: WidgetEnum.GO_TO,
    //   position: PositionEnum.CENTER, // TODO 2nd floor
    //   iconName: 'direction-arrows',
    //   onClick: () => creatorStore.setSelectedTab('gizmo'),
    //   isHidden: !creatorStore.selectedObjectId
    // },
    // {
    //   key: WidgetEnum.GO_TO,
    //   position: PositionEnum.CENTER, // TODO 2nd floor
    //   iconName: 'info',
    //   onClick: () => creatorStore.setSelectedTab('inspector'),
    //   isHidden: !creatorStore.selectedObjectId
    // },
    // {
    //   key: WidgetEnum.GO_TO,
    //   position: PositionEnum.CENTER, // TODO 2nd floor
    //   iconName: 'cubicles',
    //   onClick: () => creatorStore.setSelectedTab('functionality'),
    //   isHidden: !creatorStore.selectedObjectId
    // },

    // {
    //   key: WidgetEnum.GO_TO,
    //   position: PositionEnum.CENTER, // TODO 2nd floor
    //   iconName: 'checked',
    //   onClick: () => world3dStore?.setAttachedToCamera(null),
    //   isHidden: !world3dStore?.attachedToCameraObjectId
    // },
    // {
    //   key: WidgetEnum.GO_TO,
    //   position: PositionEnum.CENTER, // TODO 2nd floor
    //   iconName: 'bin',
    //   onClick: creatorStore.removeObjectDialog.open,
    //   isHidden: !creatorStore.selectedObjectId
    // },
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

  const items = isWelcomePage ? [] : MENU_ITEMS.filter((menuItem) => !menuItem.isHidden);
  return (
    <styled.Container data-testid="WidgetMenuPage-test">
      <Menu
        activeKeys={[...activeWidgetList, ...(subMenuInfo?.activeKeys || [])]}
        items={items}
        subMenuItems={subMenuInfo?.items || []}
        subMenuSource={subMenuInfo?.sourceItemKey}
      />
    </styled.Container>
  );
};

export default observer(WidgetMenuPage);
