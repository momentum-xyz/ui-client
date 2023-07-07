import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Radio} from '@momentum-xyz/ui-kit';
import {TokenEnum} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';

import * as styled from './TokenSelector.styled';

const tokenOptions = [
  {value: String(TokenEnum.MOM_TOKEN), label: 'MOM'},
  {value: String(TokenEnum.DAD_TOKEN), label: 'DAD'}
];

const TokenSelector: FC = () => {
  const {currentToken, setCurrentToken} = useStore().nftStore;

  return (
    <styled.TokenSelectorWrapper>
      <Radio
        name="token"
        variant="horizontal"
        value={String(currentToken)}
        options={tokenOptions}
        onChange={(val) => setCurrentToken(Number(val))}
      />
    </styled.TokenSelectorWrapper>
  );
};

export default observer(TokenSelector);
