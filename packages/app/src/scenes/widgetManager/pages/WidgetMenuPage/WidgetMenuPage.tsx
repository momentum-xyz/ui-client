import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath, useNavigate} from 'react-router-dom';
import {Menu, MenuItemInterface, PositionEnum} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';
import {WidgetEnum} from 'core/enums';
import {isFeatureEnabled} from 'api/constants';
import {FeatureFlagEnum} from 'api/enums';

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
  const {activeWidgetList, subMenuInfo} = widgetManagerStore;
  const {isMyWorld, world2dStore} = universeStore;

  const {t} = useI18n();
  const navigate = useNavigate();

  const isGuest = sessionStore.isGuest || sessionStore.isSignUpInProgress;

  const handleBackToExplore = () => {
    if (!universeStore.isScreenRecording) {
      navigate(ROUTES.explore);
    }
  };

  const handleToggle = (type: WidgetEnum, position: PositionEnum) => {
    if (!universeStore.isScreenRecording) {
      widgetManagerStore.toggle(type, position);
    }
  };

  const ODYSSEY_ITEMS: MenuItemExtendedInterface[] = sessionStore.worldsOwnedList.map((world) => ({
    key: WidgetEnum.GO_TO,
    position: PositionEnum.LEFT,
    iconName: 'rabbit_fill',
    imageSrc: world.imageSrc,
    isHidden: isWorld,
    tooltip: t('actions.visitOdyssey'),
    onClick: () => navigate(generatePath(ROUTES.odyssey.base, {worldId: world.id}))
  }));

  const NEWSFEED: MenuItemExtendedInterface[] = isFeatureEnabled(FeatureFlagEnum.NEWSFEED)
    ? [
        {
          key: WidgetEnum.NEWSFEED,
          position: PositionEnum.LEFT,
          iconName: 'newsfeed',
          tooltip: t('labels.newsfeed'),
          onClick: handleToggle
        }
      ]
    : [];

  const MENU_ITEMS: MenuItemExtendedInterface[] = [
    {
      key: WidgetEnum.EXPLORE,
      position: PositionEnum.LEFT,
      iconName: 'explore',
      isHidden: isWorld,
      tooltip: t('labels.explore'),
      onClick: handleToggle
    },
    {
      key: WidgetEnum.GO_TO,
      position: PositionEnum.LEFT,
      iconName: 'explore',
      isHidden: !isWorld,
      tooltip: t('labels.explore'),
      onClick: handleBackToExplore
    },
    {
      key: WidgetEnum.MY_PROFILE,
      position: PositionEnum.LEFT,
      iconName: 'astronaut',
      imageSrc: sessionStore.userImageUrl,
      iconIndicator: agoraStore.hasJoined ? 'voice' : undefined,
      isHidden: isGuest,
      tooltip: t('titles.myProfile'),
      onClick: handleToggle
    },
    {
      key: WidgetEnum.LOGIN,
      position: PositionEnum.LEFT,
      iconName: 'astronaut',
      isHidden: !isGuest,
      tooltip: t('login.connectAsMember'),
      onClick: handleToggle
    },
    {
      key: WidgetEnum.STAKING_VIEW,
      position: PositionEnum.LEFT,
      iconName: 'status-2',
      isHidden: isGuest,
      tooltip: t('labels.stakingOverview'),
      onClick: handleToggle
    },
    ...NEWSFEED,
    ...ODYSSEY_ITEMS,
    {
      key: WidgetEnum.STAKING,
      position: PositionEnum.CENTER,
      viewPosition: PositionEnum.RIGHT,
      iconName: 'stake',
      tooltip: t('actions.stakeInOdyssey'),
      onClick: handleToggle,
      isHidden: !isWorld || isGuest
    },
    {
      key: WidgetEnum.CREATOR,
      position: PositionEnum.CENTER,
      viewPosition: PositionEnum.RIGHT,
      iconName: 'pencil',
      isHidden: !isWorld || !isMyWorld,
      tooltip: t('actions.creatorOpen'),
      onClick: handleToggle
    },
    {
      key: WidgetEnum.TIMELINE,
      position: PositionEnum.RIGHT,
      viewPosition: PositionEnum.RIGHT,
      iconName: 'clock-two',
      isHidden: !isWorld,
      tooltip: t('labels.timeline'),
      onClick: handleToggle
    },
    {
      key: WidgetEnum.VOICE_CHAT,
      position: PositionEnum.RIGHT,
      iconName: 'voice_chat',
      iconIndicator:
        agoraStore.hasJoined && !activeWidgetList.includes(WidgetEnum.VOICE_CHAT)
          ? 'voice'
          : undefined,
      tooltip: t('labels.voiceChat'),
      onClick: handleToggle,
      isHidden: !isWorld
    },
    {
      key: WidgetEnum.WORLD_VISITORS,
      position: PositionEnum.RIGHT,
      iconName: 'group',
      onClick: handleToggle,
      tooltip: t('labels.visitors'),
      isHidden: !isWorld
    },
    {
      key: WidgetEnum.WORLD_PROFILE,
      position: PositionEnum.RIGHT,
      iconName: 'rabbit_fill',
      imageSrc: world2dStore?.imageSrc,
      tooltip: t('labels.odysseyOverview'),
      onClick: handleToggle,
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
