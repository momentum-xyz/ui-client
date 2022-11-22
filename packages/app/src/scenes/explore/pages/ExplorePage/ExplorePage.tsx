import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {SinusBox} from 'ui-kit';

import * as styled from './ExplorePage.styled';

const ExplorePage: FC = () => {
  const {exploreStore} = useStore();

  useEffect(() => {
    exploreStore.init();
  }, [exploreStore]);

  return (
    <styled.Container>
      <styled.Wrapper>
        <styled.Boxes>
          <SinusBox />
        </styled.Boxes>
      </styled.Wrapper>
    </styled.Container>
  );
};

export default observer(ExplorePage);
