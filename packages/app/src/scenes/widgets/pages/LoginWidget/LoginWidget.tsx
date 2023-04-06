import {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Panel} from '@momentum-xyz/ui-kit-storybook';
import {useI18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';

import * as styled from './LoginWidget.styled';
import {SignIn} from './components/organisms/SignIn';
import {CreateOdysseyForm} from './components/organisms/CreateOdysseyForm';

const LoginWidget: FC = () => {
  const {sessionStore, widgetManagerStore} = useStore();
  const {t} = useI18n();
  const {user, signUpUser, isGuest} = sessionStore;
  const isSignUp = signUpUser !== null;

  const handleAccountConnected = useCallback(async () => {
    console.log('handleAccountConnected');
    try {
      await sessionStore.loadUserProfile();
    } catch (e) {
      console.log('Error loading profile', e);
    }
  }, [sessionStore]);

  useEffect(() => {
    if (isGuest || signUpUser || !user?.name) {
      return;
    }
    widgetManagerStore.closeAll();
  }, [isGuest, user, signUpUser, widgetManagerStore]);

  const panelTitle = signUpUser ? t('login.signUpTitle') : t('login.signInTitle');
  const panelIconName = signUpUser ? 'astronaut' : 'enter';

  return (
    <styled.Container>
      <Panel title={panelTitle} variant="primary" icon={panelIconName}>
        {!isSignUp && <SignIn onConnected={handleAccountConnected} />}
        {isSignUp && <CreateOdysseyForm onCreated={handleAccountConnected} />}
      </Panel>
    </styled.Container>
  );
};

export default observer(LoginWidget);
