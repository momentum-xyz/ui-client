export type KeyringMetaType = {
  genesisHash?: string | null;
  isInjected?: boolean;
  name: string;
  source: string;
}

export type KeyringAddressType = {
  readonly address: string;
  readonly meta: KeyringMetaType;
  readonly publicKey: string;
};
