import {FC, memo} from 'react';

import {IconSvg} from '../../atoms';
import {IconNameType} from '../../types';

import * as styled from './WalletHash.styled';

export interface WalletHashPropsInterface {
  icon: IconNameType;
  hash: string;
}

const WalletHash: FC<WalletHashPropsInterface> = ({icon, hash}) => {
  return (
    <styled.WalletContainer>
      <IconSvg name="talisman" size="l" />
      <styled.Wallet>{hash}</styled.Wallet>
    </styled.WalletContainer>
  );
};

export default memo(WalletHash);
