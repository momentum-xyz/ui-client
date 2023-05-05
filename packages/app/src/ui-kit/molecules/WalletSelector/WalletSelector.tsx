import {FC, memo} from 'react';
import cn from 'classnames';

import {availableWallets, WalletConfigInterface} from 'wallets';

import * as styled from './WalletSelector.styled';

interface PropsInterface {
  onSelect?: (walletConf: WalletConfigInterface) => void;
}

const WalletSelector: FC<PropsInterface> = ({onSelect}) => {
  return (
    <div data-testid="WalletSelector-test">
      <styled.Methods className={cn(availableWallets.length === 4 && 'four')}>
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
    </div>
  );
};

export default memo(WalletSelector);
