import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {useStore, useSupernova} from 'shared/hooks';

import * as styled from './BirthAnimationPage.styled';

const BirthAnimationPage: FC = () => {
  const {exploreStore} = useStore();

  const history = useHistory();

  useEffect(() => {
    exploreStore.init();

    setTimeout(() => {
      history.push(ROUTES.explore);
    }, 10 * 1000);
  }, [exploreStore, history]);

  useSupernova();

  return (
    <styled.Container>
      <styled.Wrapper>
        <styled.Boxes />
        <styled.Boxes />
      </styled.Wrapper>
    </styled.Container>
  );
};

export default observer(BirthAnimationPage);
