import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {useTranslation} from 'react-i18next';
import {useHistory, useLocation} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {Web3ConnectorEnum} from 'core/enums';
import {LoginView, PanelLayout} from 'ui-kit';
import background from 'static/images/bg.png';
import momentum from 'static/images/momentum.svg';

import {AccountPicker} from './components';
import * as styled from './Web3ChoicePage.styled';

const Web3ChoicePage: FC = () => {
  const {web3ChoiceStore} = useStore().authStore;
  const {loginType, accountList, selectAccount, selectedAccount} = web3ChoiceStore;

  const {search} = useLocation();
  const {t} = useTranslation();
  const history = useHistory();
  const theme = useTheme();

  const urlParams = new URLSearchParams(search as string);
  const challenge = urlParams.get('login_challenge') || '';

  const openChallengePage = () => {
    history.push(`${ROUTES.loginWeb3}${search as string}`);
  };

  // 1. Load login type (polkadot, metamask, etc)
  useEffect(() => {
    web3ChoiceStore.fetchLoginType(challenge);

    return () => {
      web3ChoiceStore.resetModel();
    };
  }, [web3ChoiceStore]);

  // 2. It will load account list if login type is polkadot
  useEffect(() => {
    if (loginType === Web3ConnectorEnum.Polkadot) {
      web3ChoiceStore.fetchAccountList();
    } else if (loginType) {
      openChallengePage();
    }
  }, [loginType]);

  // 3. It will open challenge page if user has 1 account
  useEffect(() => {
    if (loginType === Web3ConnectorEnum.Polkadot && accountList.length === 1) {
      selectAccount(accountList[0].address);
      openChallengePage();
    }
  }, [loginType, accountList]);

  return (
    <styled.Background style={{backgroundImage: `url(${background})`}}>
      <PanelLayout isBodyExtendingToEdges>
        <LoginView
          logo={momentum}
          title={t('actions.selectPolkadotAccount')}
          okBtn={{
            variant: 'primary',
            title: t('actions.ok'),
            disabled: !selectedAccount,
            onClick: () => {
              openChallengePage();
            }
          }}
          backBtn={{
            variant: 'primary',
            title: t('actions.back'),
            onClick: () => {
              window.history.back();
            }
          }}
        >
          <AccountPicker
            theme={theme}
            accountList={accountList}
            selectedAccount={selectedAccount}
            onSelect={selectAccount}
          />
        </LoginView>
      </PanelLayout>
    </styled.Background>
  );
};

export default observer(Web3ChoicePage);
