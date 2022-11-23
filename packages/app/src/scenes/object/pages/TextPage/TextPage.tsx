import React, {FC} from 'react';
import {Heading, SvgButton} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router-dom';

import {ROUTES} from 'core/constants';

import * as styled from './TextPage.styled';

const TextPage: FC = () => {
  const history = useHistory();

  return (
    <styled.Modal data-testid="TextPage-test">
      <styled.Container>
        <styled.ContentWrapper></styled.ContentWrapper>
        <styled.HeaderElement className="left">
          <styled.Title>
            <Heading type="h2" label="Document Title" transform="uppercase" />
          </styled.Title>
        </styled.HeaderElement>
        <styled.HeaderElement className="right">
          <styled.Button>
            <SvgButton
              iconName="close"
              size="large"
              isWhite
              onClick={() => {
                history.push(ROUTES.base);
              }}
            />
          </styled.Button>
        </styled.HeaderElement>
      </styled.Container>
    </styled.Modal>
  );
};

export default observer(TextPage);
