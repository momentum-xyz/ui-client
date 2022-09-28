import React, {FC} from 'react';
import {PropsWithThemeInterface} from '@momentum/ui-kit';

import * as styled from './WalletError.styled';

interface PropsInterface extends PropsWithThemeInterface {
  error: string;
}

const WalletError: FC<PropsInterface> = ({error}) => {
  return (
    <styled.Container data-testid="WalletError-test">
      <styled.Error>{error}</styled.Error>
    </styled.Container>
  );
};
export default WalletError;
