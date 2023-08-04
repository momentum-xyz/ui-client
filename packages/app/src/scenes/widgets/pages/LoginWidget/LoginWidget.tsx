import {FC, useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import {Frame, Panel, PositionEnum, Steps} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';
import {SignUpFormInterface} from 'core/interfaces';

import {SignIn, SignUp, Welcome} from './components';
import * as styled from './LoginWidget.styled';

const LoginWidget: FC = () => {
  const {sessionStore, widgetManagerStore, widgetStore} = useStore();
  const {isSignUpInProgress} = sessionStore;
  const {loginStore} = widgetStore;

  const {t} = useI18n();

  const onUpdateProfile = useCallback(
    async (form: SignUpFormInterface) => {
      const isDone = await loginStore.updateProfile(form);
      if (isDone) {
        await sessionStore.loadUserData();
      }
    },
    [loginStore, sessionStore]
  );

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
          <Steps
            stepList={[
              {id: 'signIn', label: '1', variant: !isSignUpInProgress ? 'active' : 'prev'},
              {id: 'signUp', label: '2', variant: isSignUpInProgress ? 'active' : 'next'}
            ]}
          />
        </styled.Steps>

        <styled.Content>
          {isSignUpInProgress ? (
            <SignUp
              isUpdating={loginStore.isUpdating}
              fieldErrors={loginStore.fieldErrors}
              onUpdate={onUpdateProfile}
            />
          ) : (
            <>
              {sessionStore.user && !sessionStore.user.isGuest ? (
                <Welcome
                  user={sessionStore.user}
                  onClose={() => {
                    widgetManagerStore.open(WidgetEnum.EXPLORE, PositionEnum.LEFT);
                  }}
                />
              ) : (
                <Frame>
                  <SignIn />
                </Frame>
              )}
            </>
          )}
        </styled.Content>
      </Panel>
    </styled.Container>
  );
};

export default observer(LoginWidget);
