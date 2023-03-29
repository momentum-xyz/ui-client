import {ReactNode} from 'react';

export interface UseWalletHookReturnInterface {
  account: string | null | undefined;
  accountHex: string | null | undefined;
  content?: ReactNode;
  signChallenge: (challenge: string) => Promise<string>;
}

type WalletsToDisplayType = 'all' | 'withNfts' | 'withoutNfts';
export interface UseWalletPropsInterface {
  appVariables: {[key: string]: string};
  walletsToDisplay?: WalletsToDisplayType;
  existingNftAddresses?: string[];
}

export type UseWalletType = (props: UseWalletPropsInterface) => UseWalletHookReturnInterface;

export interface WalletConfigInterface {
  name: string;
  icon: string;
  useWallet: UseWalletType;
}
