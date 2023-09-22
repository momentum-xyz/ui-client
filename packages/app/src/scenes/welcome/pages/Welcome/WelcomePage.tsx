import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useNavigate} from 'react-router-dom';
import {PositionEnum} from '@momentum-xyz/ui-kit';

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

  useEffect(() => {
    widgetManagerStore.open(WidgetEnum.WELCOME, PositionEnum.CENTER);
  }, [widgetManagerStore]);

  useEffect(() => {
    if (!isGuest) {
      storage.setString(StorageKeyEnum.HasSeenWelcome, '1');
      const redirectRoute = storage.get(StorageKeyEnum.RedirectOnLogin);
      if (redirectRoute) {
        navigate(redirectRoute);
        storage.delete(StorageKeyEnum.RedirectOnLogin);
      } else {
        navigate(ROUTES.explore);
      }
    }
  }, [isGuest, navigate]);

  return <styled.Container data-testid="WelcomePage=test" />;
};

export default observer(WelcomePage);
