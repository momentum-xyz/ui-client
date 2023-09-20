import {FC, useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import {useLocation, useNavigate} from 'react-router-dom';
import {Hexagon, IconNameType, PositionEnum} from '@momentum-xyz/ui-kit';

import {WidgetEnum} from 'core/enums';
import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';

import * as styled from './WelcomeWidget.styled';
import {BigHexagon} from './components';

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

export interface ContentInterface {
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

  const getContentList = useCallback((): ContentInterface[] => {
    return [
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
      }
    ];
  }, [navigate, widgetManagerStore]);

  console.log(worldId, isGuest, isWelcomePage, hexagonContentList);

  const hexagons = getContentList();

  return (
    <styled.Container data-testid="WelcomeWidget-test">
      <styled.Hexagons>
        <styled.TopHexagons>
          <BigHexagon hexagon={hexagons[0]} />
          <BigHexagon hexagon={hexagons[1]} />
        </styled.TopHexagons>

        {hexagons.length === 3 && (
          <styled.BottomHexagon>
            <BigHexagon hexagon={hexagons[2]} inverse />
          </styled.BottomHexagon>
        )}

        <styled.CloseButton>
          <Hexagon
            type="fourth-borderless"
            iconName="close_large"
            onClick={widgetManagerStore.closeAll}
          />
        </styled.CloseButton>
      </styled.Hexagons>
    </styled.Container>
  );
};

export default observer(WelcomeWidget);
