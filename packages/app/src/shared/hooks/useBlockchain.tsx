import {useCallback, useMemo, useState} from 'react';
import Web3 from 'web3';
import {ethers} from 'ethers';
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
import {NodeConfigInterface} from 'core/models';

import stackingABI from './contract_staking.ABI.json';
import momABI from './contract_MOM.ABI.json';
import dadABI from './contract_DAD.ABI.json';
import faucetABI from './contract_faucet.ABI.json';
import mappingABI from './contract_mapping.ABI.json';

const DELAY_REFRESH_DATA_MS = 2000;

export interface UseBlockchainPropsInterface {
  requiredAccountAddress: string;
  requiredChainId?: number;
  wrongChainErrorMessage?: string;
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
  unbondingPeriodDays: number;
  totalUnstaked: string;
  totalClaimable: string;
  unstakes: ResolvedUnstakeInterface[];
}

const uuidToHex = (uuid: string, add0x = true) => {
  return (add0x ? '0x' : '') + uuid.replace(/-/g, '');
};

export const useBlockchain = ({
  requiredAccountAddress,
  requiredChainId,
  wrongChainErrorMessage
}: UseBlockchainPropsInterface) => {
  const {nftStore, refreshStakeRelatedData} = useStore();
  const {selectedWalletConf, setWalletIdByAddress, loadMyWallets} = nftStore;

  const [account, setAccount] = useState<string>();
  const [library, setLibrary] = useState<any>();
  const [signChallenge, setSignChallenge] = useState<(challenge: string) => Promise<string>>();
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [isWalletActive, setIsWalletActive] = useState<boolean | undefined>();

  const isCorrectAccount = account === requiredAccountAddress;

  const [stakingContract, momContract, dadContract, faucetContract, mappingContract] =
    useMemo(() => {
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

      const mappingContract = new web3.eth.Contract(
        mappingABI as any,
        appVariables.CONTRACT_MAPPING_ADDRESS
      );

      return [stakingContract, momContract, dadContract, faucetContract, mappingContract];
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

      const nftId = uuidToHex(worldId);

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

      const nftId = uuidToHex(worldId);

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

      const lockingPeriodSec = await stakingContract?.methods.locking_period().call();
      const unbondingPeriodDays = Number(lockingPeriodSec) / 60 / 60 / 24;

      const latestUnblockedUnstakeTimestamp = dayjs().subtract(unbondingPeriodDays, 'day').unix();
      console.log('[UNSTAKES] latestUnblockedUnstakeTimestamp ', latestUnblockedUnstakeTimestamp);

      const unstakes: ResolvedUnstakeInterface[] = [];
      // there's no way to know how many unstakes there are,
      // so we just try to get them one by one until we get an error
      for (let i = 0; ; i++) {
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
        unbondingPeriodDays,
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

  const sendEthers = useCallback(
    async (to: string, amount: BN) => {
      const amountStr = amount.toString();
      console.log('useBlockchain sendEthers', {to, amount, amountStr});
      if (!isCorrectAccount) {
        console.log('Incorrect account selected');
        return;
      }

      const result = await library?.getSigner(account).sendTransaction({
        to,
        value: amountStr
      });
      console.log('Transaction sent:', result);
      await result.wait();
      console.log('useBlockchain sendEthers done');
      return result;
    },
    [library, account, isCorrectAccount]
  );

  const getBalanceEthers = useCallback(async (): Promise<string> => {
    if (!isCorrectAccount) {
      throw new Error('Incorrect account selected');
    }

    console.log('useBlockchain getBalanceEthers', {account});
    const balance = await library?.getBalance(account);
    console.log('useBlockchain getBalanceEthers', {balance});
    return balance.toString();
  }, [library, account, isCorrectAccount]);

  const addNodeWithMom = useCallback(
    async (
      node_id: string,
      hostname: string,
      name: string,
      pubkey: string,
      feeAmount: BN,
      tokenKind = TokenEnum.MOM_TOKEN
    ) => {
      const hexNodeId = uuidToHex(node_id);

      if (!pubkey.startsWith('0x')) {
        pubkey = '0x' + pubkey;
      }

      console.log('useBlockchain addNodeWithMom', {
        node_id,
        hexNodeId,
        hostname,
        name,
        pubkey,
        tokenKind
      });

      const tokenContract = tokenKind === TokenEnum.MOM_TOKEN ? momContract : dadContract;

      const res = await tokenContract?.methods
        .approve(appVariables.CONTRACT_MAPPING_ADDRESS, feeAmount)
        .send({from: account});
      console.log('useBlockchain addNodeWithMom approve result', res);

      await mappingContract?.methods.addNodeWithMom(hexNodeId, hostname, name, pubkey).send({
        from: account
      });
    },
    [account, dadContract, mappingContract, momContract]
  );

  const addNodeWithEth = useCallback(
    async (node_id: string, hostname: string, name: string, pubkey: string, feeAmount: BN) => {
      const hexNodeId = uuidToHex(node_id);

      if (!pubkey.startsWith('0x')) {
        pubkey = '0x' + pubkey;
      }

      console.log('useBlockchain addNodeWithEth', {
        node_id,
        hexNodeId,
        hostname,
        name,
        pubkey,
        feeAmount
      });

      // const res = await tokenContract?.methods
      //   .approve(appVariables.CONTRACT_MAPPING_ADDRESS, feeAmount)
      //   .send({from: account});
      // console.log('useBlockchain addNodeWithEth approve result', res);

      await mappingContract?.methods.addNodeWithEth(hexNodeId, hostname, name, pubkey).send({
        from: account
      });
    },
    [account, mappingContract]
  );

  const updateNode = useCallback(
    async (node_id: string, hostname: string, name: string) => {
      const hexNodeId = uuidToHex(node_id);
      console.log('useBlockchain updateNode', {node_id, hexNodeId, hostname, name});

      await mappingContract?.methods.updateNode(hexNodeId, hostname, name).send({from: account});
    },
    [account, mappingContract]
  );

  const removeNode = useCallback(
    async (node_id: string) => {
      const hexNodeId = uuidToHex(node_id);
      console.log('useBlockchain removeNode', {node_id, hexNodeId});

      await mappingContract?.methods.removeNode(hexNodeId).send({from: account});
    },
    [account, mappingContract]
  );

  const getNodeInfo = useCallback(
    async (node_id: string): Promise<NodeConfigInterface | null> => {
      const hexNodeId = uuidToHex(node_id);
      console.log('useBlockchain getNodeInfo', {node_id, hexNodeId});

      try {
        const nodeInfo = await mappingContract?.methods.getNode(hexNodeId).call();

        console.log('useBlockchain getNodeInfo result', nodeInfo);

        return nodeInfo;
      } catch (e) {
        console.log('useBlockchain getNodeInfo error', e);
        return null;
      }
    },
    [mappingContract]
  );

  const setOdysseyMapping = useCallback(
    async (node_id: string, odyssey_id: string, signed_challenge: string) => {
      const hexNodeId = uuidToHex(node_id);
      const hexOdysseyId = uuidToHex(odyssey_id);
      console.log('useBlockchain setOdysseyMapping', {
        node_id,
        odyssey_id,
        hexNodeId,
        hexOdysseyId,
        signed_challenge
      });

      await mappingContract?.methods
        .setOdysseyMapping(hexNodeId, hexOdysseyId, signed_challenge)
        .send({from: account});
    },
    [account, mappingContract]
  );

  const setNodeMapping = useCallback(
    async (node_id: string, odyssey_id: string) => {
      const hexNodeId = uuidToHex(node_id);
      const hexOdysseyId = uuidToHex(odyssey_id);
      console.log('useBlockchain setNodeMapping', {node_id, odyssey_id, hexNodeId, hexOdysseyId});

      // const nodeIdUint256 = new BN(uuidToHex(node_id, false), 16).toArray('be', 32);
      // const odysseyIdUint256 = new BN(uuidToHex(odyssey_id, false), 16).toArray('be', 32);
      // const challenge = Uint8Array.from([...nodeIdUint256, ...odysseyIdUint256]);
      const nodeIdUint256 = ethers.BigNumber.from(uuidToHex(node_id));
      const odysseyIdUint256 = ethers.BigNumber.from(uuidToHex(odyssey_id));
      const message = ethers.utils.solidityKeccak256(
        ['uint256', 'uint256'],
        [nodeIdUint256, odysseyIdUint256]
      );
      const challenge = ethers.utils.arrayify(message);

      console.log('useBlockchain setNodeMapping challenge', challenge);

      if (!signChallenge) {
        throw new Error('Missing signMessage');
      }
      console.log('useBlockchain setNodeMapping signChallenge', challenge);
      const signature = await signChallenge(challenge as any);
      console.log('useBlockchain setNodeMapping signature:', signature);

      await mappingContract?.methods
        // .setNodeMapping(hexNodeId, hexOdysseyId, signature) // TODO uncomment this after fixed in the contract
        .setNodeMaping(hexNodeId, hexOdysseyId, signature)
        .send({from: account});
    },
    [account, mappingContract, signChallenge]
  );

  const removeMapping = useCallback(
    async (node_id: string, odyssey_id: string) => {
      const hexNodeId = uuidToHex(node_id);
      const hexOdysseyId = uuidToHex(odyssey_id);
      console.log('useBlockchain removeMapping', {node_id, odyssey_id, hexNodeId, hexOdysseyId});

      await mappingContract?.methods.removeMapping(hexNodeId, hexOdysseyId).send({from: account});
    },
    [account, mappingContract]
  );

  const getNodeForTheOdyssey = useCallback(
    async (odyssey_id: string) => {
      const hexOdysseyId = uuidToHex(odyssey_id);
      console.log('useBlockchain getNodeForOdyssey', {odyssey_id, hexOdysseyId});

      const nodeInfo = await mappingContract?.methods.getNodeForTheOdyssey(hexOdysseyId).call();

      console.log('useBlockchain getNodeForOdyssey result', nodeInfo);

      return nodeInfo;
    },
    [mappingContract]
  );

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
        requiredChainId={requiredChainId ?? +appVariables.BLOCKCHAIN_ID}
        wrongChainErrorMessage={wrongChainErrorMessage}
        onActivationDone={setIsWalletActive}
        onSelectedAccountChanged={setAccount}
        onSignChallengeLoaded={(signChallenge) => setSignChallenge(() => signChallenge)}
        onLibraryLoaded={setLibrary}
        onNetworkStatusChanged={setIsWrongNetwork}
      />
    );

  const canRequestAirdrop = account ? checkIfCanRequestAirdrop(account) : null;
  const dateOfNextAllowedAirdrop = account ? getDateOfNextAllowedAirdrop(account) : null;

  const contractsCreated = !!stakingContract && !!momContract && !!dadContract && !!faucetContract;

  console.log('useBlockchain', {
    isBlockchainReady:
      !!library && contractsCreated && isWalletActive && isCorrectAccount && !isWrongNetwork,
    account,
    walletSelectContent,
    signChallenge,
    canRequestAirdrop,
    dateOfNextAllowedAirdrop,
    sendEthers,
    getBalanceEthers,
    stake,
    unstake,
    getTokens,
    getRewards,
    claimRewards,
    getUnstakes,
    claimUnstakedTokens,
    addNodeWithMom,
    addNodeWithEth,
    updateNode,
    removeNode,
    getNodeInfo,
    setOdysseyMapping,
    setNodeMapping,
    removeMapping,
    getNodeForTheOdyssey
  });

  return {
    isBlockchainReady:
      !!library && contractsCreated && isWalletActive && isCorrectAccount && !isWrongNetwork,
    account,
    walletSelectContent,
    signChallenge,
    canRequestAirdrop,
    dateOfNextAllowedAirdrop,
    sendEthers,
    getBalanceEthers,
    stake,
    unstake,
    getTokens,
    getRewards,
    claimRewards,
    getUnstakes,
    claimUnstakedTokens,
    addNodeWithMom,
    addNodeWithEth,
    updateNode,
    removeNode,
    getNodeInfo,
    setOdysseyMapping,
    setNodeMapping,
    removeMapping,
    getNodeForTheOdyssey
  };
};
