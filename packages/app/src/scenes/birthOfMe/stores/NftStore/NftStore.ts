import {cast, flow, types} from 'mobx-state-tree';
import {ApiPromise} from '@polkadot/api';
import {BN, BN_THOUSAND, BN_TWO, BN_ZERO, bnMin, bnToBn, formatBalance} from '@polkadot/util';
import {cloneDeep} from 'lodash-es';
import {
  DeriveBalancesAll,
  DeriveSessionProgress,
  DeriveStakingAccount
} from '@polkadot/api-derive/types';
import {u64} from '@polkadot/types-codec/primitive/U64';
import {SubmittableExtrinsic} from '@polkadot/api/promise/types';
import {ResetModel} from '@momentum-xyz/core';
import {IconNameType} from '@momentum-xyz/ui-kit';

import {PolkadotAddress, PolkadotUnlockingDuration} from 'core/models';
import SubstrateProvider from 'shared/services/web3/SubstrateProvider';
import {
  calcUnbondingAmount,
  fetchIpfs,
  isIpfsHash
  // formatExistential
} from 'core/utils';
import {KeyringAddressType} from 'core/types';
import {PayeeEnum, StakingTransactionEnum} from 'core/enums';
import {inputToBN} from 'core/utils';

import {NftItem, NftItemInterface} from './models';

const NftStore = types
  .compose(
    ResetModel,
    types.model('NftStore', {
      addresses: types.optional(types.array(PolkadotAddress), []),
      stashAccount: types.maybeNull(PolkadotAddress),
      controllerAccount: types.maybeNull(PolkadotAddress),
      unlockingDuration: types.maybeNull(PolkadotUnlockingDuration),
      chainDecimals: types.maybe(types.number),
      tokenSymbol: '',
      existentialDeposit: types.optional(types.frozen(), 0),
      // minNominatorBond: '',
      ss58Format: types.maybe(types.number),
      isWeb3Injected: false,
      paymentDestination: '',
      customPaymentDestination: '',
      stakingAmount: '',
      unbondAmount: '',
      bondedAddress: types.maybeNull(types.string),
      usedStashAddress: types.maybeNull(types.string),
      transactionType: types.maybeNull(types.enumeration(Object.values(StakingTransactionEnum))),
      transactionFee: '',
      nftItems: types.optional(types.array(NftItem), []),
      isLoading: false
    })
  )
  .volatile<{
    channel: ApiPromise | null;
    stashBalanceAll: DeriveBalancesAll | null;
    controllerBalanceAll: DeriveBalancesAll | null;
    customRewardDestinationBalance: DeriveBalancesAll | null;
    stakingInfo: DeriveStakingAccount | null;
    sessionProgress: DeriveSessionProgress | null;
  }>(() => ({
    channel: null,
    stashBalanceAll: null,
    controllerBalanceAll: null,
    customRewardDestinationBalance: null,
    stakingInfo: null,
    sessionProgress: null
  }))
  .views((self) => {
    return {
      get hasAddresses() {
        return !!self.addresses.length;
      },
      get accountAddresses() {
        return self.addresses.map((account) => account.address);
      },
      get addressOptions() {
        return self.addresses.map((account) => ({
          label: account.meta?.name
            ? `${account.meta?.name} - ${account.address}`
            : account.address,
          value: account.address,
          icon: 'wallet' as IconNameType
        }));
      },
      get stashStakingBalance() {
        let locked, total, transferable, transferableWithoutFee, bonded, redeemable, unbonding;
        if (self.stashBalanceAll && self.stakingInfo) {
          locked = formatBalance(
            self.stashBalanceAll.lockedBalance,
            SubstrateProvider.FORMAT_OPTIONS,
            self.chainDecimals
          );
          total = formatBalance(
            self.stashBalanceAll.freeBalance.add(self.stashBalanceAll.reservedBalance),
            SubstrateProvider.FORMAT_OPTIONS,
            self.chainDecimals
          );
          transferable = formatBalance(
            self.stashBalanceAll.availableBalance,
            SubstrateProvider.FORMAT_OPTIONS,
            self.chainDecimals
          );

          transferableWithoutFee = formatBalance(
            self.stashBalanceAll.freeBalance.gt(self.existentialDeposit)
              ? self.stashBalanceAll.freeBalance.sub(self.existentialDeposit)
              : BN_ZERO,
            SubstrateProvider.FORMAT_OPTIONS,
            self.chainDecimals
          );

          bonded = formatBalance(
            self.stakingInfo.stakingLedger.active.unwrap(),
            SubstrateProvider.FORMAT_OPTIONS,
            self.chainDecimals
          );
          redeemable = formatBalance(
            self.stakingInfo.redeemable,
            SubstrateProvider.FORMAT_OPTIONS,
            self.chainDecimals
          );
          unbonding = formatBalance(
            calcUnbondingAmount(self.stakingInfo),
            SubstrateProvider.FORMAT_OPTIONS,
            self.chainDecimals
          );
        }

        return {
          locked,
          total,
          transferable,
          transferableWithoutFee,
          bonded,
          redeemable,
          unbonding
        };
      },
      get controllerAccountValidation() {
        const isMappedToAnotherStash =
          self.bondedAddress && self.stashAccount?.address !== self.controllerAccount?.address;
        const isManagingMultipleStashes = !!self.usedStashAddress;
        const sufficientFunds =
          formatBalance(
            self.controllerBalanceAll?.availableBalance,
            SubstrateProvider.FORMAT_OPTIONS,
            self.chainDecimals
          ) === '0';
        return {
          isMappedToAnotherStash,
          isManagingMultipleStashes,
          sufficientFunds,
          isNominatorAcceptable:
            isMappedToAnotherStash || isManagingMultipleStashes || sufficientFunds
        };
      },
      get customRewardDestinationValidation() {
        return (
          self.customRewardDestinationBalance?.freeBalance.isZero() ||
          !self.customPaymentDestination
        );
      },
      get hasCustomRewardValidation() {
        return self.paymentDestination === PayeeEnum.Account
          ? this.customRewardDestinationValidation
          : false;
      },
      // get bondAmountValidation() {
      //   const gtStashFunds =
      //     Number(this.stashStakingBalance.transferableWithoutFee) !== 0 &&
      //     Number(self.stakingAmount) > Number(this.stashStakingBalance.transferableWithoutFee);
      //   const ltThenExistentialDeposit =
      //     Number(self.stakingAmount) < Number(formatExistential(self.existentialDeposit as BN));
      //   const ltMinNominatorBond =
      //     Number(self.minNominatorBond) &&
      //     Number(self.stakingAmount) < Number(self.minNominatorBond);

      //   return {
      //     gtStashFunds,
      //     ltThenExistentialDeposit,
      //     ltMinNominatorBond,
      //     isBondAmountAcceptable: gtStashFunds || ltMinNominatorBond || ltThenExistentialDeposit
      //   };
      // },
      get unlockingProgress() {
        return SubstrateProvider.deriveUnlockingProgress(self.stakingInfo, self.sessionProgress);
      },
      get isStakingAccountUnlocking() {
        const [mapped] = this.unlockingProgress;
        return !(!self.stakingInfo || !mapped.length);
      },
      get isUnbondingPermitted() {
        const isOwnController = this.accountAddresses.includes(
          self.stakingInfo?.controllerId?.toJSON() || ''
        );
        return !(
          !isOwnController ||
          !self.stakingInfo ||
          !self.stakingInfo?.stakingLedger ||
          self.stakingInfo?.stakingLedger.active?.isEmpty
        );
      },
      get unbondAmountValidation() {
        const minAmount = Number(self.unbondAmount) <= 0;
        const maxAmount = Number(self.unbondAmount) > Number(this.stashStakingBalance.bonded);
        return {
          minAmount,
          maxAmount,
          isBondAmountAcceptable: minAmount || maxAmount
        };
      },
      get bondedControllerAddress() {
        return self.stakingInfo?.controllerId?.toJSON();
      },
      get transactionSigner() {
        const signerAddress =
          self.transactionType === StakingTransactionEnum.Bond
            ? self.stashAccount?.address
            : this.bondedControllerAddress;
        return self.addresses.find((account) => account.address === signerAddress);
      },
      get isWithdrawUnbondedPermitted() {
        return !!self.stakingInfo?.redeemable?.gtn(0);
      }
    };
  })
  .actions((self) => ({
    setIsLoading(payload: boolean) {
      self.isLoading = payload;
    },
    setNftItems(items: NftItemInterface[]) {
      self.nftItems = cast(items);
    },
    setStakingInfo(payload: DeriveStakingAccount) {
      self.stakingInfo = payload;
    },
    setStashBalanceAll(payload: DeriveBalancesAll) {
      self.stashBalanceAll = payload;
    },
    setControllerBalanceAll(payload: DeriveBalancesAll) {
      self.controllerBalanceAll = payload;
    },
    setCustomRewardDestinationBalance(payload: DeriveBalancesAll) {
      self.customRewardDestinationBalance = payload;
    },
    setSessionProgress(payload: DeriveSessionProgress) {
      self.sessionProgress = payload;
    },
    setInjectAddresses(payload: KeyringAddressType[]) {
      self.addresses = cast(payload);
    },
    setStashAccount(address: string) {
      const result = self.addresses.find((account) => account.address === address);
      self.stashAccount = cast(cloneDeep(result));
    },
    setControllerAccount(address: string) {
      const result = self.addresses.find((account) => account.address === address);
      self.controllerAccount = cast(cloneDeep(result));
    },
    setTransactionType(transactionType: StakingTransactionEnum) {
      self.transactionType = cast(transactionType);
    },
    setPaymentDestination(payee: PayeeEnum) {
      self.paymentDestination = cast(payee);
    },
    setCustomPaymentDestination(address: string) {
      self.customPaymentDestination = cast(address);
    },
    setStakingAmount(amount: string) {
      self.stakingAmount = cast(amount);
    },
    setUnbondAmount(amount: string) {
      self.unbondAmount = cast(amount);
    },
    setTransactionFee(amount: string) {
      self.transactionFee = cast(amount);
    },
    derivePaymentDestination() {
      return self.paymentDestination === PayeeEnum.Account
        ? {
            Account: self.customPaymentDestination
          }
        : self.paymentDestination;
    },
    bondExtrinsics(selectedValidators: string[]) {
      const amountBN = inputToBN(self.stakingAmount, self.chainDecimals, self.tokenSymbol);
      const txBatched: Array<SubmittableExtrinsic | undefined> = [];

      const paymentDestination = this.derivePaymentDestination();

      if (self.stashAccount?.address === self.controllerAccount?.address) {
        txBatched.push(
          self.channel?.tx.staking.bond(self.stashAccount?.address, amountBN, paymentDestination)
        );
        txBatched.push(self.channel?.tx.staking.nominate(selectedValidators));
      } else if (self.stashAccount?.address !== self.controllerAccount?.address) {
        txBatched.push(
          self.channel?.tx.staking.bond(self.stashAccount?.address, amountBN, paymentDestination)
        );
        txBatched.push(self.channel?.tx.staking.setController(self.controllerAccount?.address));
        txBatched.push(self.channel?.tx.staking.nominate(selectedValidators));
      }

      return self.channel?.tx.utility.batchAll(txBatched);
    },
    unbondExtrinsics() {
      const amountBN = inputToBN(self.unbondAmount, self.chainDecimals, self.tokenSymbol);
      return self.channel?.tx.staking.unbond(amountBN);
    },
    chillExtrinsics() {
      return self.channel?.tx.staking.chill();
    },
    async withdrawUnbondedExtrinsics() {
      const args = (await self.channel?.tx.staking.withdrawUnbonded.meta.args.length) === 1;
      const spanCount = await self.channel?.query.staking.slashingSpans(self.stakingInfo?.stashId);
      const params = args ? [spanCount] : [];
      return self.channel?.tx.staking.withdrawUnbonded(params);
    },
    async calculateFee(extrinsics: SubmittableExtrinsic | undefined) {
      const calculatedFee = await extrinsics?.paymentInfo(
        self.transactionSigner?.address as string
      );
      const feeFormatted = formatBalance(calculatedFee?.partialFee, {withSiFull: true}, 12);
      this.setTransactionFee(feeFormatted);
    },
    async calculateUnlockingDuration(blocks: BN) {
      const A_DAY = new BN(24 * 60 * 60 * 1000);
      const THRESHOLD = BN_THOUSAND.div(BN_TWO);
      const DEFAULT_TIME = new BN(6_000);

      const time =
        self.channel?.consts.babe?.expectedBlockTime ||
        self.channel?.consts.difficulty?.targetBlockTime ||
        self.channel?.consts.subspace?.expectedBlockTime ||
        ((self.channel?.consts.timestamp?.minimumPeriod as u64).gte(THRESHOLD)
          ? (self.channel?.consts.timestamp.minimumPeriod as u64).mul(BN_TWO)
          : (await self.channel?.query.parachainSystem)
          ? DEFAULT_TIME.mul(BN_TWO)
          : DEFAULT_TIME);

      const interval = bnMin(A_DAY, time as BN);
      const duration = SubstrateProvider.formatUnlockingDuration(interval, bnToBn(blocks));

      self.unlockingDuration = cast(duration);
    }
  }))
  .actions((self) => ({
    getAddresses: flow(function* () {
      yield SubstrateProvider.getAddresses(self.ss58Format).then((injectedAccounts) => {
        SubstrateProvider.loadToKeyring(
          injectedAccounts,
          self.ss58Format,
          self.channel?.genesisHash
        );
      });
      const injectedAddresses = SubstrateProvider.getKeyringAddresses();
      console.log('injectedAddresses', injectedAddresses);
      self.setInjectAddresses(injectedAddresses as KeyringAddressType[]);
    }),
    fetchNfts: flow(function* () {
      if (!self.channel) {
        throw new Error('Channel is not initialized');
      }

      const nftsItemsInfos = yield self.channel.query.uniques.asset.keys();
      console.log('nftsItemsInfos', nftsItemsInfos);
      const collectionItemIds = nftsItemsInfos.map((nftItemInfo: any) => {
        const [collectionId, itemId] = nftItemInfo.args;
        return [collectionId.toNumber(), itemId.toNumber()];
      });
      console.log('collectionItemIds', collectionItemIds);
      const itemMetadatas = yield self.channel.query.uniques.instanceMetadataOf.multi(
        collectionItemIds
      );
      console.log('metadatas', itemMetadatas, itemMetadatas?.toJSON?.());
      const nftItems: NftItemInterface[] = yield Promise.all(
        itemMetadatas.map(
          async (itemMedadata: any, index: number): Promise<NftItemInterface | null> => {
            const [collectionId, itemId] = collectionItemIds[index];
            const data = itemMedadata?.unwrapOr(null)?.data?.toHuman();
            console.log('data', data);

            if (!data) {
              return null;
            }

            let metadataStr: string | null = data as string;
            try {
              if (isIpfsHash(data)) {
                console.log('fetch from IPFS', data);
                // TODO timeout
                metadataStr = await fetchIpfs(data);
              }

              if (!metadataStr) {
                return null;
              }

              const metadata = JSON.parse(metadataStr);
              if (!metadata?.name) {
                console.log('Incomplete metadata', metadata);
                return null;
              }

              return {
                collectionId,
                id: itemId,
                ...metadata
              };
            } catch (e) {
              console.log('Unable to parse/fetch NFT metadata', data, '| Error:', e);
            }

            return null;
          }
        )
      ).then(
        (nftItems: Array<NftItemInterface | null>) =>
          nftItems.filter((nftItem) => !!nftItem) as NftItemInterface[]
      );

      console.log('NftItems', nftItems);

      self.setNftItems(nftItems);
    })
    // getMinNominatorBond: flow(function* () {
    //   const minNominatorBond = self.channel
    //     ? yield self.channel?.query.staking.minNominatorBond()
    //     : null;
    //   const minNominatorBondFormatted = formatBalance(
    //     minNominatorBond,
    //     SubstrateProvider.FORMAT_OPTIONS,
    //     self.chainDecimals
    //   );
    //   self.minNominatorBond = cast(minNominatorBondFormatted);
    // }),

    // getBondedAddress: flow(function* (address: string) {
    //   const bonded =
    //     self.channel !== null ? yield self.channel.query.staking.bonded(address) : null;
    //   self.bondedAddress = cast(bonded.toJSON());
    // }),
    // getUsedStashAddress: flow(function* (address: string) {
    //   const stash = self.channel !== null ? yield self.channel.query.staking.ledger(address) : null;
    //   const stashId = stash.toJSON() !== null ? stash.toJSON().stash : null;
    //   self.usedStashAddress = cast(stashId);
    // })
  }))
  .actions((self) => ({
    connectToChain: flow(function* () {
      self.channel = yield SubstrateProvider.initAPI();
    }),
    setIsWeb3Injected: flow(function* () {
      const isEnabled = yield SubstrateProvider.isExtensionEnabled();
      self.isWeb3Injected = cast(isEnabled);
    }),
    // initAccounts: flow(function* () {
    //   self.setStashAccount(self.addresses[0].address);
    //   self.setControllerAccount(self.addresses[0].address);
    //   yield self.getBondedAddress(self.addresses[0].address);
    //   yield self.getUsedStashAddress(self.addresses[0].address);
    // }),
    getChainInformation() {
      self.tokenSymbol = cast(
        self.channel?.registry.chainTokens[0] ? self.channel?.registry.chainTokens[0] : ''
      );

      self.ss58Format = cast(self.channel?.registry.chainSS58);
      self.chainDecimals = cast(self.channel?.registry.chainDecimals[0]);
      SubstrateProvider.setDefaultBalanceFormatting(
        self.channel?.registry.chainDecimals[0],
        self.channel?.registry.chainTokens[0]
      );

      self.existentialDeposit = cast(self.channel?.consts.balances.existentialDeposit);
      // yield self.getMinNominatorBond();
    }
  }))
  .actions((self) => ({
    init: flow(function* () {
      self.setIsLoading(true);
      yield self.connectToChain();

      yield self.setIsWeb3Injected();
      self.getChainInformation();
      yield self.getAddresses();
      // yield self.initAccounts();

      yield self.fetchNfts();

      self.setIsLoading(false);
    })
  }));

export {NftStore};
