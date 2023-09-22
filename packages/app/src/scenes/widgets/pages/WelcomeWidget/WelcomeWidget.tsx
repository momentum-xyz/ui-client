import {FC, useCallback, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {useLocation, useNavigate} from 'react-router-dom';
import {Hexagon, IconNameType, PositionEnum} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {StorageKeyEnum, WidgetEnum} from 'core/enums';
import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {storage} from 'shared/services';
import {FeatureFlagEnum} from 'api/enums';
import {isFeatureEnabled} from 'api/constants';

import {BigHexagon} from './components';
import * as styled from './WelcomeWidget.styled';

type HexagonContentType =
  | 'signUp'
  | 'enterAsGuest'
  | 'buyNft'
  | 'search'
  | 'newsfeed'
  | 'timeline'
  | 'explore'
  | 'checkCore'
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
  const {widgetManagerStore, universeStore} = useStore();
  const {worldId, world3dStore} = universeStore;

  const {t} = useI18n();
  const {pathname} = useLocation();
  const navigate = useNavigate();

  const canvasId: string = world3dStore?.canvasObjectId || '';
  const isWelcomePage = pathname === ROUTES.welcome;
  const isContributionAvailable = isFeatureEnabled(FeatureFlagEnum.CANVAS) && !!canvasId;

  const handleNavigate = useCallback(
    (redirectUrl?: string) => {
      storage.setString(StorageKeyEnum.HasSeenWelcome, '1');
      const redirectRoute = redirectUrl ? redirectUrl : storage.get(StorageKeyEnum.RedirectOnLogin);
      if (redirectRoute) {
        navigate(redirectRoute);
        storage.delete(StorageKeyEnum.RedirectOnLogin);
      } else {
        navigate(ROUTES.explore);
      }
    },
    [navigate]
  );

  const hexagonContentList: ContentInterface[] = useMemo(() => {
    return [
      {
        type: 'signUp',
        icon: 'astro',
        title: t('titles.joinAsMember'),
        message: t('messages.connectWalletJoin'),
        actionTitle: t('actions.signUpNow'),
        onAction: () => {
          handleNavigate();
          widgetManagerStore.closeAll();
          widgetManagerStore.open(WidgetEnum.LOGIN, PositionEnum.LEFT);
        }
      },
      {
        type: 'enterAsGuest',
        icon: 'rocket',
        title: t('titles.enterAsGuest'),
        message: t('messages.flyAroundCreations'),
        actionTitle: t('actions.startJourney'),
        onAction: () => {
          widgetManagerStore.closeAll();
          handleNavigate();
        }
      },
      {
        type: 'search',
        icon: 'explore',
        title: t('titles.searchOdysseysMembers'),
        message: t('messages.lookForSpace'),
        actionTitle: t('actions.startSearching'),
        onAction: () => widgetManagerStore.open(WidgetEnum.EXPLORE, PositionEnum.LEFT)
      },
      {
        type: 'newsfeed',
        icon: 'newsfeed',
        title: t('titles.checkLatestNews'),
        message: t('messages.openNewsfeed'),
        actionTitle: t('actions.openNewsfeed'),
        onAction: () => widgetManagerStore.open(WidgetEnum.NEWSFEED, PositionEnum.LEFT)
      },
      {
        type: 'checkCore',
        icon: 'idea',
        title: t('titles.aboutThisOdyssey'),
        message: t('messages.learnAboutObjectives'),
        actionTitle: t('actions.checkCore'),
        onAction: () => {
          if (isContributionAvailable) {
            widgetManagerStore.open(WidgetEnum.OBJECT, PositionEnum.RIGHT, {id: canvasId});
          } else {
            widgetManagerStore.open(WidgetEnum.WORLD_PROFILE, PositionEnum.RIGHT);
          }
        }
      },
      {
        type: 'timeline',
        icon: 'clock',
        title: t('titles.seeUpdates'),
        message: t('messages.openTimeline'),
        actionTitle: t('actions.openTimeline'),
        onAction: () => widgetManagerStore.open(WidgetEnum.TIMELINE, PositionEnum.RIGHT)
      },
      {
        type: 'contribute',
        icon: 'person_idea',
        title: t('titles.joinAction'),
        message: t('messages.makeMark'),
        actionTitle: t('labels.contribute'),
        onAction: () => widgetManagerStore.open(WidgetEnum.CONTRIBUTION_FORM, PositionEnum.RIGHT)
      },
      {
        type: 'explore',
        icon: 'rocket_flying',
        title: t('labels.explore'),
        message: t('messages.flyAroundCreations'),
        actionTitle: t('actions.flyAround'),
        onAction: () => widgetManagerStore.closeAll()
      },
      {
        type: 'buyNft',
        icon: 'rabbit_fill',
        title: t('titles.createOdyssey'),
        message: t('messages.buyNFT'),
        actionTitle: t('actions.buyNft'),
        onAction: () => handleNavigate(ROUTES.buyNft)
      }
    ];
  }, [t, handleNavigate, widgetManagerStore, isContributionAvailable, canvasId]);

  const getContentList = useCallback((): ContentInterface[] => {
    const hexagonTypeList: HexagonContentType[] = [];
    if (isWelcomePage) {
      hexagonTypeList.push('signUp', 'enterAsGuest');
      if (isFeatureEnabled(FeatureFlagEnum.BUY_NFT)) {
        hexagonTypeList.push('buyNft');
      }
    } else if (worldId && isContributionAvailable) {
      hexagonTypeList.push('checkCore', 'contribute', 'explore');
    } else if (worldId && !isContributionAvailable) {
      hexagonTypeList.push('checkCore', 'timeline', 'explore');
    } else {
      hexagonTypeList.push('search', 'newsfeed', 'explore');
    }

    return hexagonContentList.filter((i) => hexagonTypeList.includes(i.type));
  }, [hexagonContentList, isContributionAvailable, isWelcomePage, worldId]);

  const hexagons = getContentList();

  return (
    <styled.Container data-testid="WelcomeWidget-test">
      <styled.Hexagons>
        {hexagons.length >= 2 && (
          <styled.TopHexagons>
            <BigHexagon hexagon={hexagons[0]} />
            <BigHexagon hexagon={hexagons[1]} />
          </styled.TopHexagons>
        )}

        {hexagons.length === 3 && (
          <styled.BottomHexagon>
            <BigHexagon hexagon={hexagons[2]} inverse={hexagons[2].type === 'buyNft'} />
          </styled.BottomHexagon>
        )}

        {!isWelcomePage && (
          <styled.CloseButton>
            <Hexagon
              type="fourth-borderless"
              iconName="close_large"
              onClick={widgetManagerStore.closeAll}
            />
          </styled.CloseButton>
        )}
      </styled.Hexagons>
    </styled.Container>
  );
};

export default observer(WelcomeWidget);
