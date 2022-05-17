import React, {FC} from 'react';
import {useLocation} from 'react-router-dom';

import {useStore} from 'shared/hooks';

import {Web3Challenge} from './components';

const Web3ChallengePage: FC = () => {
  const {getWeb3Connector} = useStore().authStore;

  const {search} = useLocation();

  const searchParams = new URLSearchParams(search as string);
  const loginAccount = searchParams.get('login_account') || '';
  const challenge = searchParams.get('login_challenge') || '';
  const loginType = searchParams.get('login_type') || '';

  const web3Connector = getWeb3Connector(loginType);
  if (web3Connector) {
    return (
      <Web3Challenge
        challenge={challenge}
        web3Connector={web3Connector}
        loginAccount={loginAccount}
      />
    );
  }

  return null;
};

export default Web3ChallengePage;
