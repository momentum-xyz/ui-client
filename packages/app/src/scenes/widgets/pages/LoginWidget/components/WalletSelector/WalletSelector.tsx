import {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {availableWallets, WalletConfigInterface} from 'wallets';

import * as styled from './WalletSelector.styled';

interface PropsInterface {
  onSelect?: (walletConf: WalletConfigInterface) => void;
}

const WalletSelector: FC<PropsInterface> = ({onSelect}) => {
  return (
    <styled.Methods>
      {availableWallets.map((wallet) => (
        <styled.MethodItem
          key={wallet.name}
          onClick={() => {
            onSelect?.(wallet);
          }}
        >
          <img src={wallet.logo} alt={`${wallet.name}-icon`} />
          <span>{wallet.name}</span>
        </styled.MethodItem>
      ))}
    </styled.Methods>
  );
};

export default observer(WalletSelector);
