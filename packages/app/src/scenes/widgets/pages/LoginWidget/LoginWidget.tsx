import {FC, useCallback, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {Panel, Steps, StepInterface} from '@momentum-xyz/ui-kit-storybook';
import {useI18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';

import * as styled from './LoginWidget.styled';
import {WalletSelector, SignUp} from './components';

type StepsType = 'signIn' | 'signUp';

const LoginWidget: FC = () => {
  const {sessionStore, widgetManagerStore} = useStore();
  const {signUpUser, isGuest} = sessionStore;

  const {t} = useI18n();

  const isSignIn = !signUpUser && isGuest;
  const isSignUp = signUpUser || !isGuest;

  const handleAccountConnected = useCallback(
    async (close = false) => {
      console.log('handleAccountConnected');
      try {
        await sessionStore.loadUserProfile();
        if (close) {
          widgetManagerStore.closeAll();
        }
      } catch (e) {
        console.log('Error loading profile', e);
      }
    },
    [sessionStore, widgetManagerStore]
  );

  const stepList: StepInterface<StepsType>[] = useMemo(() => {
    const activeStep = isSignUp ? 1 : 0;
    return [
      {id: 'signIn', label: '1', variant: activeStep === 0 ? 'active' : 'prev'},
      {id: 'signUp', label: '2', variant: activeStep === 1 ? 'active' : 'next'}
    ];
  }, [isSignUp]);

  return (
    <styled.Container data-testid="LoginWidget-test">
      <Panel
        isFullHeight
        size="normal"
        icon="astronaut"
        variant="primary"
        title={t('login.connectAsMember')}
        onClose={widgetManagerStore.closeAll}
      >
        <styled.Steps>
          <Steps stepList={stepList} />
        </styled.Steps>

        <styled.Content>
          {isSignIn && <WalletSelector onConnected={() => handleAccountConnected(false)} />}
          {isSignUp && <SignUp onCreated={() => handleAccountConnected(true)} />}
        </styled.Content>
      </Panel>
    </styled.Container>
  );
};

export default observer(LoginWidget);
