import {cast, flow, types} from 'mobx-state-tree';
import {ApiPromise} from '@polkadot/api';
import {BN, BN_THOUSAND, BN_TWO, BN_ZERO, bnMin, bnToBn, formatBalance} from '@polkadot/util';
import {cloneDeep} from 'lodash-es';
import {DeriveSessionProgress, DeriveStakingAccount} from '@polkadot/api-derive/types';
import {u64} from '@polkadot/types-codec/primitive/U64';
import {SubmittableExtrinsic} from '@polkadot/api/promise/types';

import {
  PolkadotAddress,
  PolkadotAddressBalance,
  PolkadotUnlockingDuration,
  ResetModel
} from 'core/models';
import SubstrateProvider from 'shared/services/web3/SubstrateProvider';
import {calcUnbondingAmount, formatExistential} from 'core/utils';
import {AccountTypeBalance} from 'core/types';
import {Payee, StakingTransactionType} from 'core/enums';
import {inputToBN} from 'core/utils';

const PolkadotProviderStore = types
  .compose(
    ResetModel,
    types.model('PolkadotProvider', {
      addresses: types.optional(types.array(PolkadotAddress), []),
      stashAccount: types.maybeNull(PolkadotAddress),
      stashAccountBalance: types.maybeNull(PolkadotAddressBalance),
      controllerAccount: types.maybeNull(PolkadotAddress),
      controllerAccountBalance: types.maybeNull(PolkadotAddressBalance),
      unlockingDuration: types.maybeNull(PolkadotUnlockingDuration),
      chainDecimals: types.maybe(types.number),
      tokenSymbol: types.optional(types.string, ''),
      existentialDeposit: types.optional(types.frozen(), 0),
      minNominatorBond: types.optional(types.string, ''),
      ss58Format: types.maybe(types.number),
      isWeb3Injected: false,
      paymentDestination: types.optional(types.string, ''),
      stakingAmount: types.optional(types.string, ''),
      unbondAmount: types.optional(types.string, ''),
      bondedAddress: types.maybeNull(types.string),
      usedStashAddress: types.maybeNull(types.string),
      usedControllerAddress: types.optional(types.string, ''),
      transactionType: types.maybe(
        types.union(types.literal('bond'), types.literal('unbond'), types.literal('withdrawUnbond'))
      ),
      transactionFee: types.optional(types.string, '')
    })
  )
  .volatile<{
    channel: ApiPromise | null;
    stakingInfo: DeriveStakingAccount | null;
    sessionProgress: DeriveSessionProgress | null;
  }>(() => ({
    channel: null,
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
          icon: 'wallet' as IconName
        }));
      },
      get controllerAccountValidation() {
        const isMappedToAnotherStash =
          self.bondedAddress && self.stashAccount?.address !== self.controllerAccount?.address;
        const isManagingMultipleStashes = !!self.usedStashAddress;
        const sufficientFunds = self.controllerAccountBalance?.transferable === '0';
        return {
          isMappedToAnotherStash,
          isManagingMultipleStashes,
          sufficientFunds,
          isNominatorAcceptable:
            isMappedToAnotherStash || isManagingMultipleStashes || sufficientFunds
        };
      },
      get bondAmountValidation() {
        const gtStashFunds =
          Number(self.stashAccountBalance?.transferableWithoutFee) !== 0 &&
          Number(self.stakingAmount) > Number(self.stashAccountBalance?.transferableWithoutFee);
        const ltThenExistentialDeposit =
          Number(self.stakingAmount) < Number(formatExistential(self.existentialDeposit as BN));
        const ltMinNominatorBond =
          Number(self.minNominatorBond) &&
          Number(self.stakingAmount) < Number(self.minNominatorBond);

        return {
          gtStashFunds,
          ltThenExistentialDeposit,
          ltMinNominatorBond,
          isBondAmountAcceptable: gtStashFunds || ltMinNominatorBond || ltThenExistentialDeposit
        };
      },
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
        const maxAmount = Number(self.unbondAmount) > Number(self.stashAccountBalance?.bonded);
        return {
          minAmount,
          maxAmount,
          isBondAmountAcceptable: minAmount || maxAmount
        };
      },
      get transactionSigner() {
        const signerAddress =
          self.transactionType !== StakingTransactionType.Bond
            ? self.stashAccount?.address
            : self.usedControllerAddress;
        return self.addresses.find((account) => account.address === signerAddress);
      }
    };
  })
  .actions((self) => ({
    async init() {
      await this.connectToChain();
      await this.setIsWeb3Injected();
      await this.getChainInformation();
      await this.getSessionProgress();
      await this.initAccount();
    },
    connectToChain: flow(function* () {
      self.channel = yield SubstrateProvider.initAPI();
    }),
    setIsWeb3Injected: flow(function* () {
      const isEnabled = yield SubstrateProvider.isExtensionEnabled();
      self.isWeb3Injected = cast(isEnabled);
    }),
    getAddresses: flow(function* () {
      const addresses = yield SubstrateProvider.getAddresses(self.ss58Format);
      self.addresses = cast(addresses);
    }),
    getSessionProgress: flow(function* () {
      self.sessionProgress =
        self.channel !== null ? yield self.channel?.derive.session.progress() : null;
    }),
    getStakingInfo: flow(function* (address: string) {
      self.stakingInfo =
        self.channel !== null ? yield self.channel?.derive.staking.account(address) : null;
    }),
    getBalances: flow(function* (address: string, accountTypeBalance: AccountTypeBalance) {
      const balanceAll =
        self.channel !== null ? yield self.channel.derive.balances?.all(address) : null;

      const stakingInfo =
        self.channel !== null ? yield self.channel.derive.staking?.account(address) : null;

      const locked = formatBalance(
        balanceAll.lockedBalance,
        SubstrateProvider.FORMAT_OPTIONS,
        self.chainDecimals
      );
      const total = formatBalance(
        balanceAll.freeBalance.add(balanceAll.reservedBalance),
        SubstrateProvider.FORMAT_OPTIONS,
        self.chainDecimals
      );
      const transferable = formatBalance(
        balanceAll.availableBalance,
        SubstrateProvider.FORMAT_OPTIONS,
        self.chainDecimals
      );

      const transferableWithoutFee = formatBalance(
        balanceAll.freeBalance.gt(self.existentialDeposit)
          ? balanceAll.freeBalance.sub(self.existentialDeposit)
          : BN_ZERO,
        SubstrateProvider.FORMAT_OPTIONS,
        self.chainDecimals
      );

      const bonded = formatBalance(
        stakingInfo.stakingLedger.active.unwrap(),
        SubstrateProvider.FORMAT_OPTIONS,
        self.chainDecimals
      );
      const redeemable = formatBalance(
        stakingInfo.redeemable,
        SubstrateProvider.FORMAT_OPTIONS,
        self.chainDecimals
      );
      const unbonding = formatBalance(
        calcUnbondingAmount(stakingInfo),
        SubstrateProvider.FORMAT_OPTIONS,
        self.chainDecimals
      );

      self[accountTypeBalance] = cast({
        locked,
        total,
        transferable,
        bonded,
        redeemable,
        unbonding,
        transferableWithoutFee
      });
    }),
    getBondedAddress: flow(function* (address: string) {
      const bonded =
        self.channel !== null ? yield self.channel.query.staking.bonded(address) : null;
      self.bondedAddress = cast(bonded.toJSON());
    }),
    getUsedStashAddress: flow(function* (address: string) {
      const stash = self.channel !== null ? yield self.channel.query.staking.ledger(address) : null;
      const stashId = stash.toJSON() !== null ? stash.toJSON().stash : null;
      self.usedStashAddress = cast(stashId);
    }),
    getUsedControllerAddress() {
      const usedControllerAddress = self.stakingInfo?.controllerId?.toJSON()
        ? self.stakingInfo?.controllerId?.toJSON()
        : '';
      self.usedControllerAddress = cast(usedControllerAddress);
    },
    getMinNominatorBond: flow(function* () {
      const minNominatorBond = self.channel
        ? yield self.channel?.query.staking.minNominatorBond()
        : null;
      const minNominatorBondFormatted = formatBalance(
        minNominatorBond,
        SubstrateProvider.FORMAT_OPTIONS,
        self.chainDecimals
      );
      self.minNominatorBond = cast(minNominatorBondFormatted);
    }),
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
    },
    async initAccount() {
      await this.getAddresses();
      this.setStashAccount(self.addresses[0].address);
      if (self.stashAccount?.address) {
        await this.setControllerAccount(self.stashAccount.address);
        await this.getBondedAddress(self.stashAccount.address);
        await this.getUsedStashAddress(self.stashAccount.address);
      }
    },
    async getChainInformation() {
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
      await this.getMinNominatorBond();
    },
    async setStashAccount(address: string) {
      const result = self.addresses.find((account) => account.address === address);
      self.stashAccount = cast(cloneDeep(result));
      await this.getBalances(address, 'stashAccountBalance');
      await this.getStakingInfo(address);
      await this.getUsedControllerAddress();
    },
    async setControllerAccount(address: string) {
      const result = self.addresses.find((account) => account.address === address);
      self.controllerAccount = cast(cloneDeep(result));
      await this.getBalances(address, 'controllerAccountBalance');
    },
    setTransactionType(transactionType: StakingTransactionType) {
      self.transactionType = cast(transactionType);
    },
    setPaymentDestination(payee: Payee) {
      self.paymentDestination = cast(payee);
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
    bondExtrinsics(selectedValidators: string[]) {
      const amountBN = inputToBN(self.stakingAmount, self.chainDecimals, self.tokenSymbol);
      const txBatched: Array<SubmittableExtrinsic | undefined> = [];

      if (self.stashAccount?.address === self.controllerAccount?.address) {
        txBatched.push(
          self.channel?.tx.staking.bond(
            self.stashAccount?.address,
            amountBN,
            self.paymentDestination
          )
        );
        txBatched.push(self.channel?.tx.staking.nominate(selectedValidators));
      } else if (self.stashAccount?.address !== self.controllerAccount?.address) {
        txBatched.push(
          self.channel?.tx.staking.bond(
            self.stashAccount?.address,
            amountBN,
            self.paymentDestination
          )
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
    withdrawUnbondedExtrinsics() {
      return self.channel?.tx.staking.withdrawUnbonded();
    },
    async calculateFee(extrinsics: SubmittableExtrinsic | undefined) {
      const calculatedFee = await extrinsics?.paymentInfo(self.transactionSigner?.address as any);
      const feeFormatted = formatBalance(calculatedFee?.partialFee, {withSiFull: true}, 12);
      this.setTransactionFee(feeFormatted);
    }
  }));

export {PolkadotProviderStore};
