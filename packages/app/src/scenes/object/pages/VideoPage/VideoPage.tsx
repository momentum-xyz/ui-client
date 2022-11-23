import React, {FC} from 'react';
import {SvgButton, Text} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router-dom';

import {ROUTES} from 'core/constants';

import * as styled from './VideoPage.styled';

const VideoPage: FC = () => {
  const history = useHistory();

  return (
    <styled.Modal data-testid="VideoPage-test">
      <styled.Container>
        <styled.ContentWrapper></styled.ContentWrapper>
        <styled.HeaderElement className="left">
          <styled.Title>
            <Text text="Video Name" transform="uppercase" weight="bold" size="xl" />
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

export default observer(VideoPage);
