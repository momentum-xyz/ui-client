import {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useNavigate} from 'react-router-dom';
import {Button, Hexagon, PositionEnum} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {storage} from 'shared/services';
import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';
import {StorageKeyEnum, WidgetEnum} from 'core/enums';

import * as styled from './WelcomePage.styled';

export const HAS_SEEN_WELCOME_VALUE = '1';

const WelcomePage: FC = () => {
  const {widgetManagerStore, sessionStore} = useStore();
  const {isGuest} = sessionStore;
  const navigate = useNavigate();
  const {t} = useI18n();

  useEffect(() => {
    widgetManagerStore.closeAll();
  }, [widgetManagerStore]);

  const handleNavigation = useCallback(
    (widget: WidgetEnum) => {
      storage.setString(StorageKeyEnum.HasSeenWelcome, HAS_SEEN_WELCOME_VALUE);
      widgetManagerStore.open(widget, PositionEnum.LEFT);
      const redirectRoute = storage.get(StorageKeyEnum.RedirectOnLogin);
      if (redirectRoute) {
        navigate(redirectRoute);
        storage.delete(StorageKeyEnum.RedirectOnLogin);
      } else {
        navigate(ROUTES.explore);
      }
    },
    [navigate, widgetManagerStore]
  );

  useEffect(() => {
    if (!isGuest) {
      handleNavigation(WidgetEnum.EXPLORE);
    }
  }, [isGuest, handleNavigation]);

  return (
    <styled.Container data-testid="WelcomePage=test">
      <styled.Card>
        <styled.CardHexContainer>
          <Hexagon type="primary-borderless" iconName="astronaut" />
        </styled.CardHexContainer>
        <styled.CardTitle>{t('labels.welcomePageJoinTitle')}</styled.CardTitle>
        <styled.CardDescription>{t('labels.welcomePageJoinDescription')}</styled.CardDescription>
        <Button
          wide
          icon="astronaut"
          label={t('actions.signUpNow')}
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
            wide
            icon="rocket"
            variant="secondary"
            label={t('actions.startJourney')}
            onClick={() => handleNavigation(WidgetEnum.EXPLORE)}
          />
        </styled.CardButtonContainer>
      </styled.Card>
    </styled.Container>
  );
};

export default observer(WelcomePage);
