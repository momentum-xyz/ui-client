import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {useStore, useSupernova} from 'shared/hooks';

import * as styled from './BirthAnimationPage.styled';

const BirthAnimationPage: FC = () => {
  const {sessionStore} = useStore();

  const history = useHistory();

  useEffect(() => {
    sessionStore.loadUserProfile();

    setTimeout(() => {
      const from = window.history.state?.state?.from;
      history.push(from || ROUTES.explore);
    }, 10 * 1000);
  }, [sessionStore, history]);

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
