import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {SinusBox} from 'ui-kit';
import {BuildJourney} from 'scenes/birthOfMe/components';

import * as styled from './BirthOfMePage.styled';

const BirthOfMePage: FC = () => {
  const {birthOfMeStore} = useStore();
  const {signInStore} = birthOfMeStore;

  const history = useHistory();

  useEffect(() => {
    signInStore.fetchAddresses();

    return () => {
      signInStore.resetModel();
    };
  }, [signInStore]);

  return (
    <styled.Container>
      <styled.Wrapper>
        <styled.Boxes>
          <SinusBox />
          <BuildJourney onBuild={() => history.push(ROUTES.explore)} />
        </styled.Boxes>
      </styled.Wrapper>
    </styled.Container>
  );
};

export default observer(BirthOfMePage);
