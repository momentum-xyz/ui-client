import {cast, flow, getSnapshot, types} from 'mobx-state-tree';
import BN from 'bn.js';
import {ResetModel, RequestModel, TokenEnum} from '@momentum-xyz/core';
import {IconNameType} from '@momentum-xyz/ui-kit';

import {Wallet, Stake} from 'core/models';
import {BN_ZERO} from 'core/constants';
import {storage} from 'shared/services';
import {StorageKeyEnum} from 'core/enums';
import {formatBigInt, getRootStore, tokenKindToSymbol} from 'core/utils';
import {PluginIdEnum} from 'api/enums';
import {api, StakeInterface, WalletInterface} from 'api';
import {availableWallets, dummyWalletConf, WalletConfigInterface} from 'wallets';
import {appVariables} from 'api/constants';

const TokenKindToContractAddress = {
  [TokenEnum.MOM_TOKEN]: appVariables.CONTRACT_MOM_ADDRESS,
  [TokenEnum.DAD_TOKEN]: appVariables.CONTRACT_DAD_ADDRESS
};

interface AccountBalanceInterface {
  free: BN;
  reserved: BN;
  // transferable: BN; // don't use yet, not implemendted in BE
  unbonding: BN;
}

const NftStore = types
  .compose(
    ResetModel,
    types.model('NftStore', {
      _wallets: types.optional(types.array(Wallet), []),
      walletsAddresses: types.optional(types.array(types.string), []), // TEMP
      walletsIdByAddress: types.optional(types.map(types.string), {}),
      stakes: types.optional(types.array(Stake), []),
      defaultWalletId: '',
      _selectedWalletId: types.maybeNull(types.string),
      currentToken: types.optional(types.frozen<TokenEnum>(), TokenEnum.MOM_TOKEN),

      chainDecimals: types.optional(types.number, 18),

      accumulatedRewards: types.frozen(new BN(0)),

      walletsRequest: types.optional(RequestModel, {}),
      stakesRequest: types.optional(RequestModel, {}),
      postPendingStakeRequest: types.optional(RequestModel, {})
    })
  )
  .views((self) => ({
    get tokenSymbol(): string {
      return tokenKindToSymbol(self.currentToken);
    },
    get selectedWalletId(): string {
      console.log(
        '[Blockchain] selectedWalletId',
        self._selectedWalletId,
        self.defaultWalletId,
        self.walletsAddresses[0]
      );
      return self._selectedWalletId || self.defaultWalletId || self.walletsAddresses[0];
    },
    get wallets(): WalletInterface[] {
      const walletList = self.walletsAddresses.map(
        (address) =>
          self._wallets.find((w) => w.wallet_id === address) || {
            wallet_id: address,
            balance: '0',
            staked: '0',
            unbonding: '0',
            transferable: '0',
            reward: '0',
            blockchain_name: '',
            contract_id: '',
            updated_at: ''
          }
      );

      return walletList.map((wallet) => {
        const walletId = self.walletsIdByAddress.get(wallet.wallet_id);
        const walletConf = availableWallets.find((w) => w.id === walletId);
        return {
          ...wallet,
          wallet_icon: walletConf?.icon
        };
      });
    }
  }))
  .views((self) => ({
    get selectedWallet(): WalletInterface | undefined {
      const contractId = TokenKindToContractAddress[self.currentToken];
      console.log(
        '[Blockchain] selectedWallet',
        self.selectedWalletId,
        contractId,
        self.currentToken,
        self.wallets
      );
      return self._wallets.find(
        (w) => w.wallet_id === self.selectedWalletId && w.contract_id === contractId
      );
    },
    get selectedWalletConf(): WalletConfigInterface {
      const walletId = self.walletsIdByAddress.get(self.selectedWalletId);
      return availableWallets.find((w) => w.id === walletId) || dummyWalletConf;
    },
    get hasDADTokens(): boolean {
      return self._wallets.some(
        (wallet) => wallet.contract_id === TokenKindToContractAddress[TokenEnum.DAD_TOKEN]
      );
    }
  }))
  .views((self) => ({
    get balance(): AccountBalanceInterface {
      const wallet = self.selectedWallet;
      console.log('[Blockchain] BALANCE', wallet);
      if (!wallet) {
        return {
          free: new BN(0),
          reserved: new BN(0),
          // transferable: new BN(0),
          unbonding: new BN(0)
        };
      }
      return {
        free: new BN(wallet.balance),
        reserved: new BN(wallet.staked),
        // transferable: new BN(wallet.transferable),
        unbonding: new BN(wallet.unbonding)
      };
    }
  }))
  .views((self) => ({
    get walletOptions(): Array<{label: string; value: string; icon: IconNameType}> {
      console.log('[Blockchain] walletOptions', self.walletsAddresses);
      return self.walletsAddresses.map((address) => {
        const walletId = self.walletsIdByAddress.get(address);
        const conf = availableWallets.find((w) => w.id === walletId) || dummyWalletConf;

        return {
          label: address,
          value: address,
          icon: conf.icon
        };
      });
    }
  }))
  .actions((self) => ({
    afterCreate() {
      self.walletsIdByAddress = cast(storage.get<any>(StorageKeyEnum.WalletsByAddress) || {});
    },
    setWalletIdByAddress(address: string, walletId: string) {
      self.walletsIdByAddress.set(address, walletId);
      const map = getSnapshot(self.walletsIdByAddress);
      storage.set<typeof map>(StorageKeyEnum.WalletsByAddress, map);
    }
  }))
  .actions((self) => ({
    loadMyWallets: flow(function* () {
      const response: Array<WalletInterface> = yield self.walletsRequest.send(
        api.userRepository.fetchMyWallets,
        {}
      );
      if (response) {
        self._wallets = cast(response);
      }

      const userId: string = getRootStore(self).sessionStore.user!.id;

      // TEMP, fetchMyWallets doesn't return empty wallet addresses
      const responseWallets = yield self.walletsRequest.send(
        api.userAttributeRepository.getPluginUserAttributeValue,
        {
          attributeName: 'wallet',
          userId,
          pluginId: PluginIdEnum.WALLETS
        }
      );
      console.log('[Blockchain] responseWallets', responseWallets);
      if (responseWallets?.wallet) {
        self.walletsAddresses = cast(responseWallets.wallet);
      }
    }),
    loadMyStakes: flow(function* () {
      const response: Array<StakeInterface> = yield self.walletsRequest.send(
        api.userRepository.fetchMyStakes,
        {}
      );
      if (response) {
        self.stakes = cast(response.filter((stake) => !!stake.amount && stake.amount !== '0'));
      }
    }),
    /*postPendingStake: flow(function* (options: {
      transaction_id: string;
      odyssey_id: string;
      wallet: string;
      comment: string;
      amount: string;
      kind: string;
    }) {
      yield self.postPendingStakeRequest.send(api.userRepository.postPendingStake, options);
    }),*/
    loadDefaultWalletId(): void {
      const storedAccount = storage.get<string>(StorageKeyEnum.DefaultAccount);
      if (storedAccount && self.wallets.find((w) => w.wallet_id === storedAccount)) {
        self.setDefaultWalletId(storedAccount);
      } else if (self.wallets.length > 0) {
        self.setDefaultWalletId(self.wallets[0].wallet_id);
      }
    },
    setDefaultWalletId(walletId: string) {
      storage.setString(StorageKeyEnum.DefaultAccount, walletId);
      self.defaultWalletId = walletId;
      self._selectedWalletId = walletId;
    },
    setSelectedWalletId(walletId: string | null) {
      self._selectedWalletId = walletId;
    },
    setCurrentToken(token: TokenEnum) {
      self.currentToken = token;
    }
  }))
  .views((self) => ({
    get balanceTransferrableBN(): BN {
      try {
        const transferrable = self.balance.free
          .clone()
          .sub(self.balance.reserved)
          .sub(self.balance.unbonding);
        const zero = new BN(0);
        return transferrable.gt(zero) ? transferrable : zero;
      } catch (err) {
        console.error(err);
        return new BN(0);
      }
    },
    get balanceStakedBN(): BN {
      const walletId = self._selectedWalletId || self.defaultWalletId || self.walletsAddresses[0];

      const stakedAmount = new BN(0);

      self.stakes
        .filter((stake) => stake.wallet_id === walletId)
        .forEach((stake) => {
          stakedAmount.iadd(new BN(stake.amount));
        });

      return stakedAmount;
    }
  }))
  .views((self) => ({
    get balanceTransferrable(): string {
      return formatBigInt(self.balanceTransferrableBN.toString());
    },
    get balanceStaked(): string {
      return formatBigInt(self.balanceStakedBN.toString());
    },
    canBeStaked(amount: BN): boolean {
      try {
        return amount.gt(BN_ZERO) && self.balanceTransferrableBN.gte(amount);
      } catch (err) {
        console.error(err);
        return false;
      }
    }
  }))
  .actions((self) => ({
    initMyWalletsAndStakes: flow(function* () {
      yield self.loadMyWallets();
      if (self.hasDADTokens) {
        self.setCurrentToken(TokenEnum.DAD_TOKEN);
      }

      yield self.loadMyStakes();
      self.loadDefaultWalletId();
    })
  }));

export {NftStore};
