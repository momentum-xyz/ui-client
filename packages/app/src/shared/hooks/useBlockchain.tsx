import {useCallback, useMemo, useState} from 'react';
import Web3 from 'web3';
import BN from 'bn.js';
import {TokenEnum} from '@momentum-xyz/core';
import dayjs from 'dayjs';

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

export const UNBONDING_PERIOD_DAYS = 7;

export interface UseBlockchainPropsInterface {
  requiredAccountAddress: string;
}

export interface BlockchainRewardsInterface {
  mom_rewards: string;
  dad_rewards: string;
  total_rewards: string;
}

export interface UnstakeInterface {
  dad_amount: string;
  mom_amount: string;
  unstaking_timestamp: string;
}
export interface ResolvedUnstakeInterface {
  value: string;
  unblockTimestamp: string;
}
export interface UnbondingInfoInterface {
  totalUnstaked: string;
  totalClaimable: string;
  unstakes: ResolvedUnstakeInterface[];
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

  const getUnstakes = useCallback(
    async (account: string, tokenKind: TokenEnum): Promise<UnbondingInfoInterface> => {
      console.log('[UNSTAKES] Account ', account);
      const latestUnblockedUnstakeTimestamp = dayjs().subtract(UNBONDING_PERIOD_DAYS, 'day').unix();
      console.log('[UNSTAKES] latestUnblockedUnstakeTimestamp ', latestUnblockedUnstakeTimestamp);

      const unstakes: ResolvedUnstakeInterface[] = [];
      for (let i = 0; i < 1000; i++) {
        try {
          console.log('[UNSTAKES] Account ', account, i);
          const unstakeInfo: UnstakeInterface = await stakingContract?.methods
            .unstakes(account, i)
            .call();
          console.log('[UNSTAKES] unstakeInfo ', unstakeInfo);
          if (!unstakeInfo) {
            break;
          }

          const {dad_amount, mom_amount, unstaking_timestamp} = unstakeInfo;

          if (tokenKind === TokenEnum.DAD_TOKEN && dad_amount !== '0') {
            unstakes.push({
              value: dad_amount,
              unblockTimestamp: unstaking_timestamp
            });
          } else if (tokenKind === TokenEnum.MOM_TOKEN && mom_amount !== '0') {
            unstakes.push({
              value: mom_amount,
              unblockTimestamp: unstaking_timestamp
            });
          }
        } catch (e) {
          break;
        }
      }
      console.log('[UNSTAKES] Result ', unstakes);

      const totalUnstaked = unstakes.reduce(
        (acc, unstake) => acc.add(new BN(unstake.value)),
        new BN(0)
      );
      console.log('[UNSTAKES] totalUnstaked ', totalUnstaked.toString());

      const totalClaimable = unstakes
        .filter((unstake) => Number(unstake.unblockTimestamp) < latestUnblockedUnstakeTimestamp)
        .reduce((acc, unstake) => acc.add(new BN(unstake.value)), new BN(0));
      console.log('[UNSTAKES] totalClaimable ', totalClaimable.toString());

      return {
        totalUnstaked: totalUnstaked.toString(),
        totalClaimable: totalClaimable.toString(),
        unstakes
      };
    },
    [stakingContract]
  );

  const claimUnstakedTokens = useCallback(async () => {
    console.log('useBlockchain claimUnstaked');
    if (!isCorrectAccount) {
      console.log('Incorrect account selected');
      return;
    }

    const result = await stakingContract?.methods.claim_unstaked_tokens().send({from: account});
    console.log('useBlockchain claimUnstaked result', result);

    setTimeout(() => loadMyWallets().catch(console.error), DELAY_REFRESH_DATA_MS);
  }, [stakingContract, account, isCorrectAccount, loadMyWallets]);

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
    getTokens,
    getRewards,
    claimRewards,
    getUnstakes,
    claimUnstakedTokens
  };
};
