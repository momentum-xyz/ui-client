import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {
  SinusBox,
  JourneyBox,
  TravellerBox,
  ChoiceWallet,
  ChoiceName
} from 'scenes/birthOfMe/components';

import * as styled from './SignInPage.styled';

const SignInPage: FC = () => {
  const {birthOfMeStore} = useStore();

  const history = useHistory();

  useEffect(() => {
    birthOfMeStore.init();
  }, [birthOfMeStore]);

  return (
    <styled.Container>
      <styled.Wrapper>
        <styled.Boxes>
          <SinusBox />
          <TravellerBox />
          <SinusBox />
          <JourneyBox onCreate={() => history.push(ROUTES.birthOfMe.startAccount)} />
        </styled.Boxes>

        <styled.Boxes>
          <ChoiceWallet />
          <SinusBox />
          <ChoiceName />
        </styled.Boxes>
      </styled.Wrapper>
    </styled.Container>
  );
};

export default observer(SignInPage);
