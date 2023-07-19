import {useCallback, useMemo, useState} from 'react';
import Web3 from 'web3';
import BN from 'bn.js';
import {TokenEnum} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';
import {dummyWalletConf} from 'wallets';
import {appVariables} from 'api/constants';
import {WalletSelectHelper, WalletSelector} from 'ui-kit';
import {
  checkIfCanRequestAirdrop,
  getDateOfNextAllowedAirdrop,
  saveLastAirdropInfo as originalSaveLastAirdropInfo
} from 'core/utils';

import stackingABI from './contract_staking.ABI.json';
import momABI from './contract_MOM.ABI.json';
import dadABI from './contract_DAD.ABI.json';
import faucetABI from './contract_faucet.ABI.json';

const DELAY_REFRESH_DATA_MS = 2000;

export interface UseBlockchainPropsInterface {
  requiredAccountAddress: string;
}

export interface BlockchainRewardsInterface {
  mom_rewards: string;
  dad_rewards: string;
  total_rewards: string;
}

export const useBlockchain = ({requiredAccountAddress}: UseBlockchainPropsInterface) => {
  const {nftStore, refreshStakeRelatedData} = useStore();
  const {selectedWalletConf, setWalletIdByAddress, loadMyWallets} = nftStore;

  const [account, setAccount] = useState<string>();
  const [library, setLibrary] = useState<any>();
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [isWalletActive, setIsWalletActive] = useState<boolean | undefined>();

  const isCorrectAccount = account === requiredAccountAddress;

  const [stakingContract, momContract, dadContract, faucetContract] = useMemo(() => {
    if (!library) {
      return [];
    }
    const web3 = new Web3(library.provider);

    const stakingContract = new web3.eth.Contract(
      stackingABI as any,
      appVariables.CONTRACT_STAKING_ADDRESS
    );

    const momContract = new web3.eth.Contract(momABI as any, appVariables.CONTRACT_MOM_ADDRESS);
    const dadContract = new web3.eth.Contract(dadABI as any, appVariables.CONTRACT_DAD_ADDRESS);

    const faucetContract = new web3.eth.Contract(
      faucetABI as any,
      appVariables.CONTRACT_FAUCET_ADDRESS
    );

    return [stakingContract, momContract, dadContract, faucetContract];
  }, [library]);

  const stake = useCallback(
    async (worldId: string, amount: BN, tokenKind = TokenEnum.MOM_TOKEN) => {
      console.log('useBlockchain stake');
      if (!isCorrectAccount) {
        console.log('Incorrect account selected');
        return;
      }

      const tokenContract = tokenKind === TokenEnum.MOM_TOKEN ? momContract : dadContract;

      const res = await tokenContract?.methods
        .approve(appVariables.CONTRACT_STAKING_ADDRESS, amount)
        .send({from: account});
      console.log('useBlockchain stake approve result', res);

      const nftId = '0x' + worldId.replace(/-/g, '');

      console.log('useBlockchain stake into nftId', nftId, amount, tokenKind);
      const result = await stakingContract?.methods
        .stake(nftId, amount, tokenKind)
        .send({from: account});
      console.log('useBlockchain stake result', result);

      setTimeout(() => refreshStakeRelatedData().catch(console.error), DELAY_REFRESH_DATA_MS);

      return result;
    },
    [momContract, dadContract, account, stakingContract, isCorrectAccount, refreshStakeRelatedData]
  );

  const unstake = useCallback(
    async (worldId: string, tokenKind = TokenEnum.MOM_TOKEN) => {
      console.log('useBlockchain unstake');
      if (!isCorrectAccount) {
        console.log('Incorrect account selected');
        return;
      }

      const nftId = '0x' + worldId.replace(/-/g, '');

      console.log('useBlockchain unstake from nftId', nftId, tokenKind);
      const result = await stakingContract?.methods.unstake(nftId, tokenKind).send({from: account});
      console.log('useBlockchain unstake result', result);

      setTimeout(() => refreshStakeRelatedData().catch(console.error), DELAY_REFRESH_DATA_MS);
    },
    [account, stakingContract, isCorrectAccount, refreshStakeRelatedData]
  );

  const saveLastAirdropInfo = useCallback(() => {
    if (!account) {
      return;
    }
    originalSaveLastAirdropInfo(account);
  }, [account]);

  const getTokens = useCallback(
    async (tokenKind = TokenEnum.MOM_TOKEN) => {
      console.log('useBlockchain getTokens', {tokenKind});
      if (!isCorrectAccount) {
        console.log('Incorrect account selected');
        return;
      }

      const result = await faucetContract?.methods.get_tokens(tokenKind).send({from: account});
      console.log('useBlockchain getTokens result', result);
      saveLastAirdropInfo();

      setTimeout(() => loadMyWallets().catch(console.error), DELAY_REFRESH_DATA_MS);
    },
    [account, faucetContract?.methods, isCorrectAccount, loadMyWallets, saveLastAirdropInfo]
  );

  const getRewards = useCallback(
    async (account: string): Promise<BlockchainRewardsInterface> => {
      console.log('[REWARDS] Account ', account);
      const rewardsInfo = await stakingContract?.methods.stakers(account).call();
      console.log('[REWARDS] Result ', rewardsInfo);

      return rewardsInfo
        ? {
            mom_rewards: rewardsInfo.mom_rewards || '0',
            dad_rewards: rewardsInfo.dad_rewards || '0',
            total_rewards: rewardsInfo.total_rewards || '0'
          }
        : {
            mom_rewards: '0',
            dad_rewards: '0',
            total_rewards: '0'
          };
    },
    [stakingContract]
  );

  const claimRewards = useCallback(async () => {
    console.log('useBlockchain claimRewards');
    if (!isCorrectAccount) {
      console.log('Incorrect account selected');
      return;
    }

    const result = await stakingContract?.methods.claim_rewards().send({from: account});
    console.log('useBlockchain claimRewards result', result);

    setTimeout(() => loadMyWallets().catch(console.error), DELAY_REFRESH_DATA_MS);
  }, [stakingContract, account, isCorrectAccount, loadMyWallets]);

  const walletSelectContent =
    selectedWalletConf === dummyWalletConf ? (
      <WalletSelector
        onSelect={(walletConf) => {
          if (walletConf) {
            setWalletIdByAddress(requiredAccountAddress, walletConf.id);
          }
        }}
      />
    ) : (
      <WalletSelectHelper
        key={selectedWalletConf.id}
        walletConf={selectedWalletConf}
        requiredAccountAddress={requiredAccountAddress}
        onActivationDone={setIsWalletActive}
        onSelectedAccountChanged={setAccount}
        onLibraryLoaded={setLibrary}
        onNetworkStatusChanged={setIsWrongNetwork}
      />
    );

  const canRequestAirdrop = account ? checkIfCanRequestAirdrop(account) : null;
  const dateOfNextAllowedAirdrop = account ? getDateOfNextAllowedAirdrop(account) : null;

  const contractsCreated = !!stakingContract && !!momContract && !!dadContract && !!faucetContract;

  return {
    isBlockchainReady:
      !!library && contractsCreated && isWalletActive && isCorrectAccount && !isWrongNetwork,
    account,
    walletSelectContent,
    canRequestAirdrop,
    dateOfNextAllowedAirdrop,
    stake,
    unstake,
    claimRewards,
    getTokens,
    getRewards
  };
};
