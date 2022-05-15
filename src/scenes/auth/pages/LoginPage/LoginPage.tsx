import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {useTranslation} from 'react-i18next';

import {useStore} from 'shared/hooks';
import {LoginView, PanelLayout} from 'ui-kit';
import background from 'static/images/bg.png';
import momentum from 'static/images/momentum.svg';

import {NetworkPicker, NetworkRemarks, WalletError} from './components';
import * as styled from './LoginPage.styled';

const LoginPage: FC = () => {
  const {loginStore, web3ConnectorsFiltered} = useStore().authStore;
  const {isRefreshButtonShown, isWeb3LoginStarted, isSessionExpired, errorMessage} = loginStore;

  const theme = useTheme();
  const {t} = useTranslation();

  useEffect(() => {
    localStorage.clear();
  }, []);

  useEffect(() => {
    if (isWeb3LoginStarted) {
      loginStore.web3SignIn();
    }
  }, [isWeb3LoginStarted, loginStore]);

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
