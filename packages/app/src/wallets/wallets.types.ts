import {IconNameType} from '@momentum-xyz/ui-kit';
import {ReactNode} from 'react';

export interface UseWalletHookReturnInterface {
  account: string | null | undefined;
  accountHex: string | null | undefined;
  isInstalled: boolean;
  activate: () => Promise<void>;
  isActive: boolean | undefined;
  content?: ReactNode;
  web3Library?: any;
  chainId?: number;
  signChallenge: (challenge: string) => Promise<string>;
}
export interface UseWalletPropsInterface {
  appVariables: {[key: string]: string};
  onActivationDone: (success: boolean) => void;
}

export type UseWalletType = (props: UseWalletPropsInterface) => UseWalletHookReturnInterface;

export interface WalletConfigInterface {
  id: string;
  name: string;
  logo: string;
  icon: IconNameType;
  browserExtensionUrl: string;
  useWallet: UseWalletType;
}
