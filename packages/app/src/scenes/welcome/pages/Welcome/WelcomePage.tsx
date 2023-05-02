import {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useNavigate} from 'react-router-dom';
import {Hexagon, PositionEnum, Button} from '@momentum-xyz/ui-kit-storybook';
import {useI18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';
import {WidgetEnum} from 'core/enums';

import * as styled from './WelcomePage.styled';

export const HAS_SEEN_WELCOME_PAGE_LS_KEY = 'hasSeenWelcomePage';
export const HAS_SEEN_WELCOME_PAGE_LS_VALUE = '1';

const WelcomePage: FC = () => {
  const {widgetManagerStore, sessionStore} = useStore();
  const {toggle} = widgetManagerStore;
  const {isGuest} = sessionStore;
  const navigate = useNavigate();
  const {t} = useI18n();

  const handleNavigation = useCallback(
    (widget?: WidgetEnum) => {
      if (widget) {
        toggle(widget, PositionEnum.LEFT);
      }
      localStorage.setItem(HAS_SEEN_WELCOME_PAGE_LS_KEY, HAS_SEEN_WELCOME_PAGE_LS_VALUE);
      navigate(ROUTES.explore);
    },
    [navigate, toggle]
  );

  useEffect(() => {
    const hasSeenWelcomePage =
      localStorage.getItem(HAS_SEEN_WELCOME_PAGE_LS_KEY) === HAS_SEEN_WELCOME_PAGE_LS_VALUE;
    if (!isGuest || hasSeenWelcomePage) {
      handleNavigation();
    }
  }, [handleNavigation, isGuest]);

  return (
    <styled.Container>
      <styled.Card>
        <styled.CardHexContainer>
          <Hexagon type="primary-borderless" iconName="astronaut" />
        </styled.CardHexContainer>
        <styled.CardTitle>{t('labels.welcomePageJoinTitle')}</styled.CardTitle>
        <styled.CardDescription>{t('labels.welcomePageJoinDescription')}</styled.CardDescription>
        <Button
          label={t('actions.signUpNow')}
          icon="astronaut"
          wide
          onClick={() => handleNavigation(WidgetEnum.LOGIN)}
        />
      </styled.Card>
      <styled.Card className="light">
        <styled.CardHexContainer className="light">
          <Hexagon type="primary-borderless" iconName="rocket" />
        </styled.CardHexContainer>
        <styled.CardTitle className="light">{t('labels.welcomePageGuestTitle')}</styled.CardTitle>
        <styled.CardDescription className="light">
          {t('labels.welcomePageGuestDescription')}
        </styled.CardDescription>
        <styled.CardButtonContainer className="light">
          <Button
            label={t('actions.startJourney')}
            icon="rocket"
            variant="secondary"
            wide
            onClick={() => handleNavigation(WidgetEnum.EXPLORE)}
          />
        </styled.CardButtonContainer>
      </styled.Card>
    </styled.Container>
  );
};

export default observer(WelcomePage);
