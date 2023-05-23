import {FC, memo} from 'react';
import cn from 'classnames';

import {IconSvg} from '../../atoms';
import {IconNameType} from '../../types';

import * as styled from './WalletHash.styled';

export interface WalletHashPropsInterface {
  icon?: IconNameType;
  hash: string;
}

const WalletHash: FC<WalletHashPropsInterface> = ({icon, hash}) => {
  return (
    <styled.WalletContainer data-testid="WalletHash-test" className={cn(!icon && 'noIcon')}>
      {icon && <IconSvg name={icon} size="l" />}
      <styled.Wallet>{hash}</styled.Wallet>
    </styled.WalletContainer>
  );
};

export default memo(WalletHash);
