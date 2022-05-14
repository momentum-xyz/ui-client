import React, {FC, useCallback} from 'react';
import {useLocation} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useTheme} from 'styled-components';
import {WalletConnectConnector} from '@web3-react/walletconnect-connector';

import {storage} from 'core/services';
import {LoginView, PanelLayout} from 'ui-kit';
import {useEager, useStore} from 'shared/hooks';
import {StorageKeyEnum, Web3ConnectorEnum} from 'core/enums';
import background from 'static/images/bg.png';
import momentum from 'static/images/momentum.svg';

import {WalletMessage} from './components';
import * as styled from './Web3ChallengePage.styled';

const Web3ChallengePage: FC = () => {
  const {web3Connectors, web3ChallengeStore} = useStore().authStore;
  const {getChallengeForSign, loginAccept, getErrorMessage} = web3ChallengeStore;

  const theme = useTheme();
  const {search} = useLocation();
  const {t} = useTranslation();

  const connector = storage.get<Web3ConnectorEnum>(StorageKeyEnum.Web3Connector);
  const polkadotAddress = storage.get<string>(StorageKeyEnum.PolkadotAddress);
  const web3Connector = web3Connectors.find((item) => item.name === connector);
  const challenge = new URLSearchParams(search as string).get('login_challenge') || '';

  const onAccepted = useCallback((url: string) => {
    storage.delete(StorageKeyEnum.Web3Connector);
    window.location.href = url;
  }, []);

  const onReset = useCallback(() => {
    if (web3Connector?.connector && web3Connector.connector instanceof WalletConnectConnector) {
      web3Connector.connector = null;
    }
  }, []);

  const {error} = useEager(
    challenge,
    web3Connector!,
    polkadotAddress,
    getChallengeForSign,
    loginAccept,
    onAccepted,
    onReset
  );

  return (
    <styled.Background style={{backgroundImage: `url(${background})`}}>
      <PanelLayout isBodyExtendingToEdges>
        <LoginView
          logo={momentum}
          title={t('login.enableStaking')}
          backBtn={{
            variant: 'primary',
            title: t('actions.back'),
            onClick: () => window.history.back()
          }}
        >
          <styled.Container>
            <WalletMessage
              theme={theme}
              walletError={error}
              connectorType={connector}
              getErrorMessage={getErrorMessage}
            />
          </styled.Container>
        </LoginView>
      </PanelLayout>
    </styled.Background>
  );
};
export default Web3ChallengePage;
