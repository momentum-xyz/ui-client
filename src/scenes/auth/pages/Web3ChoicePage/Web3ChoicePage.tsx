import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {useTranslation} from 'react-i18next';
import {useHistory, useLocation} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {LoginTypeEnum} from 'core/enums';
import {LoginView, PanelLayout} from 'ui-kit';
import background from 'static/images/bg.png';
import momentum from 'static/images/momentum.svg';

import {AccountPicker} from './components';
import * as styled from './Web3ChoicePage.styled';

const Web3ChoicePage: FC = () => {
  const {web3ChoiceStore} = useStore().authStore;
  const {loginType, accountList, selectAccount, selectedAccount, guestRedirect} = web3ChoiceStore;

  const {search} = useLocation();
  const {t} = useTranslation();
  const history = useHistory();
  const theme = useTheme();

  const urlParams = new URLSearchParams(search as string);
  const challenge = urlParams.get('login_challenge') || '';

  const openChallengePage = useCallback(
    (skipChoiceRedirect: boolean) => {
      const params = new URLSearchParams();
      params.append('login_challenge', challenge);
      params.append('login_type', loginType || '');
      params.append('login_account', selectedAccount || '');
      params.append('skip_choice_redirect', skipChoiceRedirect ? '1' : '');

      history.push({pathname: ROUTES.loginWeb3, search: params.toString()});
    },
    [challenge, history, loginType, selectedAccount]
  );

  useEffect(() => {
    web3ChoiceStore.fetchLoginType(challenge);
    return () => {
      web3ChoiceStore.resetModel();
    };
  }, [challenge, web3ChoiceStore]);

  useEffect(() => {
    if (loginType === LoginTypeEnum.Polkadot) {
      web3ChoiceStore.fetchAccountList();
    }
  }, [loginType, web3ChoiceStore]);

  useEffect(() => {
    if (loginType === LoginTypeEnum.Guest) {
      web3ChoiceStore.guestLogin(challenge);
    }
  }, [challenge, loginType, web3ChoiceStore]);

  useEffect(() => {
    if (loginType && loginType !== LoginTypeEnum.Polkadot && loginType !== LoginTypeEnum.Guest) {
      openChallengePage(true);
    }
  }, [loginType, openChallengePage, web3ChoiceStore]);

  useEffect(() => {
    if (loginType === LoginTypeEnum.Polkadot && accountList.length === 1) {
      openChallengePage(true);
    }
  }, [loginType, accountList, selectAccount, openChallengePage]);

  useEffect(() => {
    if (guestRedirect) {
      window.location.href = guestRedirect;
    }
  }, [guestRedirect]);

  if (loginType === LoginTypeEnum.Polkadot) {
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
                openChallengePage(false);
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
            {accountList.length > 0 && (
              <AccountPicker
                theme={theme}
                accountList={accountList}
                selectedAccount={selectedAccount}
                onSelect={selectAccount}
              />
            )}
          </LoginView>
        </PanelLayout>
      </styled.Background>
    );
  }

  return <></>;
};

export default observer(Web3ChoicePage);
