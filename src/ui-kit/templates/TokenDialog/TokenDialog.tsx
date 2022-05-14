import React, {FC} from 'react';
import {useTheme} from 'styled-components';

import {Dialog, Input, Text} from 'ui-kit/index';

import * as styled from './TokenDialog.styled';

interface PropsInterface {
  onClose: () => void;
}

const TokenDialog: FC<PropsInterface> = ({onClose}) => {
  const theme = useTheme();

  return (
    <Dialog
      theme={theme}
      title="Define a new token rule"
      showCloseButton
      onClose={onClose}
      approveInfo={{title: 'submit rule for approval', onClick: () => null}}
      closeOnBackgroundClick={true}
    >
      <styled.Container>
        <styled.Div>
          <styled.TextItem>
            <Text text="Define a new token rule for the list" size="s" align="left" />
          </styled.TextItem>
          <styled.Item>
            <Input label="new token rule name" placeholder="Add a Name Here" isCustom />
          </styled.Item>
          <styled.Item>
            <styled.StyledSearchInput
              label="token select"
              placeholder="Select or Add New Token"
              onChange={(value) => console.info(`Searching for '${value}'`)}
              delay={300}
              withBackground
            />
          </styled.Item>
          <styled.Item>
            <Input
              label="minimum balance"
              placeholder="Add a Minimum Balance To This Rule"
              isCustom
            />
          </styled.Item>
        </styled.Div>
      </styled.Container>
    </Dialog>
  );
};

export default TokenDialog;
