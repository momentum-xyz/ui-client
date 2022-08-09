import React, {FC, useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {useTheme} from 'styled-components';
import {WalletConnectConnector} from '@web3-react/walletconnect-connector';

import {LoginView, PanelLayout} from 'ui-kit';
import {Web3ConnectorInterface} from 'core/interfaces';
import {useEager, useStore} from 'shared/hooks';
import background from 'static/images/bg.png';
import momentum from 'static/images/momentum.svg';

import {WalletMessage} from './components';
import * as styled from './Web3Challenge.styled';

interface PropsInterface {
  web3Connector: Web3ConnectorInterface;
  challenge: string;
  loginAccount: string;
  skipChoiceRedirect: boolean;
}

const Web3Challenge: FC<PropsInterface> = (props) => {
  const {web3Connector, challenge, loginAccount, skipChoiceRedirect} = props;

  const {web3ChallengeStore} = useStore().authStore;
  const {getChallengeForSign, loginAccept, getErrorMessage} = web3ChallengeStore;

  const {t} = useTranslation();
  const theme = useTheme();

  const onAccepted = useCallback((url: string) => {
    window.location.href = url;
  }, []);

  const onReset = useCallback(() => {
    if (web3Connector?.connector && web3Connector.connector instanceof WalletConnectConnector) {
      web3Connector.connector = null;
    }
  }, [web3Connector]);

  // Prevent cycle redirects
  const goBack = useCallback(() => {
    if (skipChoiceRedirect) {
      // User didn't choose account. System must redirect to main login page
      window.history.go(-2);
    } else {
      // User chose account. System must redirect to main account list page
      window.history.go(-1);
    }
  }, [skipChoiceRedirect]);

  const {error} = useEager(
    challenge,
    web3Connector,
    loginAccount,
    getChallengeForSign,
    loginAccept,
    onAccepted,
    onReset
  );

  return (
    <styled.Background background={background} data-testid="Web3Challenge-test">
      <PanelLayout isBodyExtendingToEdges>
        <LoginView
          logo={momentum}
          title={t('login.enableStaking')}
          backBtn={{
            variant: 'primary',
            title: t('actions.back'),
            onClick: goBack
          }}
        >
          <styled.Container>
            <WalletMessage
              theme={theme}
              walletError={error}
              loginType={web3Connector.name}
              getErrorMessage={getErrorMessage}
            />
          </styled.Container>
        </LoginView>
      </PanelLayout>
    </styled.Background>
  );
};
export default observer(Web3Challenge);
