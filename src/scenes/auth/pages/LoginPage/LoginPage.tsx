import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';

import {useStore} from 'shared/hooks';
import {LoginView, PanelLayout} from 'ui-kit';
import background from 'static/images/bg.png';
import momentum from 'static/images/momentum.svg';

import {NetworkPicker, NetworkRemarks, WalletError} from './components';
import * as styled from './LoginPage.styled';

const LoginPage: FC = () => {
  const {loginStore, web3ConnectorsFiltered} = useStore().authStore;
  const {isRefreshButtonShown, isSessionExpired, errorMessage} = loginStore;
  const {isWeb3LoginStarted, isGuestLoginStarted} = loginStore;

  const theme = useTheme();
  const {t} = useTranslation();
  const history = useHistory();

  useEffect(() => {
    localStorage.clear();
    console.log('from-' + history.location?.state?.from);
    // http://localhost:3000/magic/f4b873a9-9e29-45d0-8b12-181bf1772675
  }, []);

  useEffect(() => {
    if (isWeb3LoginStarted) {
      loginStore.web3SignIn();
    }
  }, [isWeb3LoginStarted, loginStore]);

  useEffect(() => {
    if (isGuestLoginStarted) {
      loginStore.guestSignIn();
    }
  }, [isGuestLoginStarted, loginStore]);

  return (
    <styled.Background background={background}>
      <PanelLayout isBodyExtendingToEdges>
        <LoginView
          logo={momentum}
          title={t('messages.signIn')}
          {...(isRefreshButtonShown && {
            backBtn: {
              variant: 'primary',
              title: t('actions.refresh'),
              onClick: () => {
                document.location.reload();
              }
            }
          })}
        >
          {errorMessage ? (
            <WalletError error={errorMessage} />
          ) : (
            <styled.Networks>
              <NetworkPicker
                theme={theme}
                web3Connectors={web3ConnectorsFiltered}
                onSelect={loginStore.chooseNetwork}
              />
              <NetworkRemarks theme={theme} />
            </styled.Networks>
          )}
        </LoginView>
        {isSessionExpired && (
          <styled.SessionExpired>{t('errors.sessionExpired')}</styled.SessionExpired>
        )}
      </PanelLayout>
    </styled.Background>
  );
};

export default observer(LoginPage);
