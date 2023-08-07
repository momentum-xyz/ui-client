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
  const {isSignUpInProgress, isBuyNftFlow} = sessionStore;
  const {loginStore} = widgetStore;

  const isGuest = !!sessionStore.user?.isGuest;
  const isFillingUpProfile = !isGuest && isSignUpInProgress;
  const isReady = !isGuest && !!sessionStore.user && !isSignUpInProgress;

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

  const handleCloseWelcome = () => {
    if (isBuyNftFlow) {
      widgetManagerStore.open(WidgetEnum.BUY_NFT, PositionEnum.LEFT);
    } else {
      widgetManagerStore.open(WidgetEnum.EXPLORE, PositionEnum.LEFT);
    }
  };

  return (
    <styled.Container data-testid="LoginWidget-test">
      <Panel
        isFullHeight
        size="normal"
        icon="astronaut"
        variant="primary"
        title={isBuyNftFlow ? t('labels.getYourOdyssey') : t('login.connectAsMember')}
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
          {isGuest && (
            <Frame>
              {!isBuyNftFlow ? (
                <>
                  <styled.Title>{t('login.howToConnectAsAMemberTitle')}</styled.Title>
                  <styled.Desc>{t('login.howToConnectAsAMemberDescription')}</styled.Desc>
                </>
              ) : (
                <>
                  <styled.Title>{t('labels.getYourOdysseyTitle')}</styled.Title>
                  <styled.Desc>{t('labels.getYourOdysseyDescription')}</styled.Desc>
                </>
              )}

              <SignIn />
            </Frame>
          )}

          {isFillingUpProfile && (
            <SignUp
              isUpdating={loginStore.isUpdating}
              fieldErrors={loginStore.fieldErrors}
              onUpdate={onUpdateProfile}
            />
          )}

          {isReady && !!sessionStore.user && (
            <Welcome user={sessionStore.user} onClose={handleCloseWelcome} />
          )}
        </styled.Content>
      </Panel>
    </styled.Container>
  );
};

export default observer(LoginWidget);
