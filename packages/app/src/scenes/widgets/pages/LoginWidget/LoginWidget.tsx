import {FC, useCallback, useEffect, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {Panel, FrameSteps, StepInterface} from '@momentum-xyz/ui-kit-storybook';
import {useI18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';

import * as styled from './LoginWidget.styled';
import {SignIn, SignUp} from './components';

const LoginWidget: FC = () => {
  const {sessionStore, widgetManagerStore} = useStore();
  const {t} = useI18n();
  const {user, signUpUser, isGuest} = sessionStore;

  // const isSignIn = !signUpUser && isGuest;
  // const isSignUp = signUpUser || !isGuest;
  const isSignUp = !!signUpUser;

  console.log(signUpUser, user);

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

  const stepList: StepInterface[] = useMemo(() => {
    const activeStep = isSignUp || user ? 1 : 0;
    return [
      {label: '1', variant: activeStep === 0 ? 'active' : 'prev'},
      {label: '2', variant: activeStep === 1 ? 'active' : 'next'}
    ];
  }, [isSignUp, user]);

  const onClose = () => {
    widgetManagerStore.closeAll();
  };

  return (
    <styled.Container>
      <Panel
        title={t('login.connectAsMember')}
        variant="primary"
        icon="astronaut"
        onClose={onClose}
      >
        <FrameSteps stepList={stepList}>
          {/* {isSignIn && <SignIn onConnected={handleAccountConnected} />} */}
          {!isSignUp && <SignIn onConnected={handleAccountConnected} />}
          {isSignUp && <SignUp onCreated={handleAccountConnected} />}
        </FrameSteps>
      </Panel>
    </styled.Container>
  );
};

export default observer(LoginWidget);
