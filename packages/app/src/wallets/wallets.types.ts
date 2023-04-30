import {IconNameType} from '@momentum-xyz/ui-kit-storybook';
import {ReactNode} from 'react';

export interface UseWalletHookReturnInterface {
  account: string | null | undefined;
  accountHex: string | null | undefined;
  isInstalled: boolean;
  activate: () => Promise<void>;
  isActive: boolean | undefined;
  content?: ReactNode;
  web3Library?: any;
  signChallenge: (challenge: string) => Promise<string>;
}
export interface UseWalletPropsInterface {
  appVariables: {[key: string]: string};
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
