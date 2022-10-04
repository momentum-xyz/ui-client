import React, {FC} from 'react';
import {SvgButton, Text} from '@momentum/ui-kit';

import * as styled from './TokenRuleListItem.styled';

interface PropsInterface {
  name: string;
  tokenGroupUserId: string;
  tokenRuleId: string;
  type?: string;
  onEdit: (id: string) => void;
  onRemove: (id: string, name: string) => void;
}

const TokenRuleListItem: FC<PropsInterface> = (props) => {
  const {name, tokenGroupUserId, type, tokenRuleId} = props;

  return (
    <styled.Container>
      <styled.InfoContainer>
        <Text text={name} size="s" align="left" transform="uppercase" weight="bold" />
        {type && <styled.TokenRuleTypeText text={type} size="m" align="left" />}
      </styled.InfoContainer>
      <styled.Buttons>
        <SvgButton
          iconName="edit"
          size="normal"
          onClick={() => {
            props.onEdit(tokenGroupUserId);
          }}
        />
        <SvgButton
          iconName="bin"
          size="normal"
          onClick={() => {
            props.onRemove(tokenRuleId, name);
          }}
        />
      </styled.Buttons>
    </styled.Container>
  );
};

export default TokenRuleListItem;
