import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {Footer, SinusBox} from 'ui-kit';
import {BuildOdyssey, ExplorePanel} from 'scenes/birthOfMe/components';

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
          <BuildOdyssey onBuild={() => history.push(ROUTES.birthOfMe.explore)} />
        </styled.Boxes>

        <styled.Boxes>
          <ExplorePanel />
        </styled.Boxes>
      </styled.Wrapper>
      <Footer />
    </styled.Container>
  );
};

export default observer(BirthOfMePage);
