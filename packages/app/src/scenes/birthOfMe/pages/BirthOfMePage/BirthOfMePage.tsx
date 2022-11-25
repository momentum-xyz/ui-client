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
  const {signInStore, exploreStore} = birthOfMeStore;

  const history = useHistory();

  useEffect(() => {
    signInStore.fetchAddresses();
    exploreStore.init();

    return () => {
      signInStore.resetModel();
    };
  }, [signInStore, exploreStore]);

  return (
    <styled.Container>
      <styled.Wrapper>
        <styled.Boxes>
          <SinusBox />
          <BuildOdyssey onBuild={() => history.push(ROUTES.birthOfMe.explore)} />
        </styled.Boxes>

        <styled.Boxes>
          <ExplorePanel
            odysseyCount={exploreStore.odysseyCount}
            newsFeed={exploreStore.newsFeed}
            onTeleport={(id) => alert(`Teleport to ${id}`)}
            onConnect={(id) => alert(`Connect to ${id}`)}
          />
        </styled.Boxes>
      </styled.Wrapper>
      <Footer />
    </styled.Container>
  );
};

export default observer(BirthOfMePage);
