import {KeyringJson$Meta} from '@polkadot/ui-keyring/types';

export type KeyringAddressesType = {
  readonly address: string;
  readonly meta: KeyringJson$Meta;
  readonly publicKey: string;
};
