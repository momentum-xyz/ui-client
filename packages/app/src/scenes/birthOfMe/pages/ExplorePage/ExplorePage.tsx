import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {Footer, SinusBox} from 'ui-kit';
import {ExplorePanel} from 'scenes/birthOfMe/components';

import * as styled from './ExplorePage.styled';

const ExplorePage: FC = () => {
  return (
    <styled.Container>
      <styled.Wrapper>
        <styled.Boxes>
          <SinusBox />
        </styled.Boxes>

        <styled.Boxes>
          <ExplorePanel />
        </styled.Boxes>
      </styled.Wrapper>

      <Footer />
    </styled.Container>
  );
};

export default observer(ExplorePage);
