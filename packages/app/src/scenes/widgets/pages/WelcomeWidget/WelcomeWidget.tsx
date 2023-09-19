import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useLocation, useNavigate} from 'react-router-dom';
import {IconNameType, PositionEnum} from '@momentum-xyz/ui-kit';

import {WidgetEnum} from 'core/enums';
import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';

import * as styled from './WelcomeWidget.styled';

type HexagonPositionType = 'left' | 'right' | 'bottom';
type HexagonContentType =
  | 'signUp'
  | 'enterAsGuest'
  | 'buyNft'
  | 'search'
  | 'newsfeed'
  | 'timeline'
  | 'fly'
  | 'contributions'
  | 'contribute';

interface ContentInterface {
  type: HexagonContentType;
  icon: IconNameType;
  title: string;
  message: string;
  actionTitle: string;
  onAction: () => void;
}

const WelcomeWidget: FC = () => {
  const {widgetManagerStore, sessionStore, universeStore} = useStore();
  const {worldId, world3dStore} = universeStore;
  const {isGuest} = sessionStore;

  const {pathname} = useLocation();
  const navigate = useNavigate();

  const isWelcomePage = pathname === ROUTES.welcome;

  const hexagonContentList: ContentInterface[] = [
    {
      type: 'signUp',
      icon: 'astro',
      title: 'Join Odyssey as a member',
      message: 'Connect your wallet and join the community',
      actionTitle: 'Sign up now',
      onAction: () => widgetManagerStore.open(WidgetEnum.LOGIN, PositionEnum.LEFT)
    },
    {
      type: 'enterAsGuest',
      icon: 'rocket',
      title: 'Enter Odyssey as a guest',
      message: 'Fly around freely and enjoy all the creations',
      actionTitle: 'Start your journey',
      onAction: () => widgetManagerStore.closeAll()
    },
    {
      type: 'buyNft',
      icon: 'rabbit_fill',
      title: 'Create your own Odyssey',
      message: 'Buy a 3D environment NFT and start creating',
      actionTitle: 'Buy Odyssey nft',
      onAction: () => navigate(ROUTES.buyNft)
    },
    {
      type: 'search',
      icon: 'explore',
      title: 'Search Odysseys and members',
      message: 'Look for the space of your interest',
      actionTitle: 'Start searching',
      onAction: () => widgetManagerStore.open(WidgetEnum.EXPLORE, PositionEnum.LEFT)
    },
    {
      type: 'newsfeed',
      icon: 'newsfeed',
      title: 'Check the latest news in Odyssey',
      message: 'Open the newsfeed and see everything happening',
      actionTitle: 'Open the newsfeed',
      onAction: () => widgetManagerStore.open(WidgetEnum.NEWSFEED, PositionEnum.LEFT)
    },
    {
      type: 'fly',
      icon: 'rocket_flying',
      title: 'Explore',
      message: 'Fly around freely and enjoy all the creations ',
      actionTitle: 'Fly around',
      onAction: () => widgetManagerStore.closeAll()
    },
    {
      type: 'timeline',
      icon: 'clock',
      title: 'See the latest updates',
      message: 'Open the timeline and see what’s going on',
      actionTitle: 'Open timeline',
      onAction: () => widgetManagerStore.open(WidgetEnum.TIMELINE, PositionEnum.LEFT)
    },
    {
      type: 'contributions',
      icon: 'idea',
      title: 'About this Odyssey',
      message: 'Learn about the objectives and collective results',
      actionTitle: 'Check the core',
      onAction: () =>
        widgetManagerStore.open(WidgetEnum.OBJECT, PositionEnum.RIGHT, {
          id: world3dStore?.canvasObjectId || ''
        })
    },
    {
      type: 'contribute',
      icon: 'person_idea',
      title: 'Join the action',
      message: 'make a mark and participate in the mission',
      actionTitle: 'Contribute',
      onAction: () => widgetManagerStore.open(WidgetEnum.CONTRIBUTION_FORM, PositionEnum.RIGHT)
    }
  ];

  const renderHexagon = (position: HexagonPositionType): ContentInterface | null => {
    switch (position) {
      case 'left':
        return null;
      case 'right':
        return null;
      case 'bottom':
        return null;
      default:
        return null;
    }
  };

  console.log(worldId, isGuest, isWelcomePage, hexagonContentList, renderHexagon);

  return (
    <styled.Container data-testid="WelcomeWidget-test">
      <styled.Hexagons>
        <styled.TopHexagons>
          <styled.BigHexagon className="hexagon">
            <span>I am 1</span>
          </styled.BigHexagon>
          <styled.BigHexagon className="hexagon">
            <span>I am 2</span>
          </styled.BigHexagon>
        </styled.TopHexagons>
        <styled.BottomHexagon>
          <styled.BigHexagon className="hexagon">
            <span>I am 3</span>
          </styled.BigHexagon>
        </styled.BottomHexagon>
      </styled.Hexagons>
    </styled.Container>
  );
};

export default observer(WelcomeWidget);
