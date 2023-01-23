import {Text} from '@momentum-xyz/ui-kit';
import {FC} from 'react';

import odysseyLogo from 'static/images/Odyssey_3.svg';

import * as styled from './TestnetMarkWidget.styled';

interface PropsInterface {
  withOffset?: boolean;
}

export const TestnetMarkWidget: FC<PropsInterface> = ({withOffset}) => {
  return (
    <styled.Container className={withOffset ? 'withOffset' : undefined}>
      <styled.Img src={odysseyLogo} alt="Odyssey" />
      <Text text="Testnet version" size="xxs" align="right" />
    </styled.Container>
  );
};
