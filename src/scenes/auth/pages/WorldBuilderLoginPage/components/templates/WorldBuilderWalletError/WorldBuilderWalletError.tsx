import React, {FC} from 'react';

import {PropsWithThemeInterface} from 'ui-kit';

import * as styled from './WorldBuilderWalletError.styled';

interface PropsInterface extends PropsWithThemeInterface {
  error: string;
}

const WorldBuilderWalletError: FC<PropsInterface> = ({error}) => {
  return (
    <styled.Container data-testid="WalletError-test">
      <styled.Error>{error}</styled.Error>
    </styled.Container>
  );
};
export default WorldBuilderWalletError;
