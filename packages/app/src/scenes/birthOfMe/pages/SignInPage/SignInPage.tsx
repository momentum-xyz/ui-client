import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {SinusBox} from 'ui-kit';
import {CreateOdyssey, TravellerBox, ChoiceWallet, ChoiceName} from 'scenes/birthOfMe/components';

import * as styled from './SignInPage.styled';

const SignInPage: FC = () => {
  const {authStore} = useStore();

  const history = useHistory();

  useEffect(() => {
    authStore.init();
  }, [authStore]);

  const signChallengeAndGetToken = useCallback(async () => {
    const token = await authStore.getTokenByWallet();
    if (token) {
      // TODO: axios
      console.log(token);
      history.push(ROUTES.birthOfMe.explore);
    }
  }, [authStore, history]);

  return (
    <styled.Container>
      <styled.Wrapper>
        <styled.Boxes>
          <SinusBox />
          <TravellerBox />
          <SinusBox />
          <CreateOdyssey onCreate={() => history.push(ROUTES.birthOfMe.startAccount)} />
        </styled.Boxes>

        <styled.Boxes>
          <ChoiceWallet
            walletOptions={authStore.accountOptions}
            wallet={authStore.wallet}
            isConnectDisabled={authStore.isPending}
            onSelectAddress={authStore.selectWallet}
            onConnect={signChallengeAndGetToken}
          />
          <SinusBox />
          <ChoiceName onExplore={() => history.push(ROUTES.birthOfMe.explore)} />
        </styled.Boxes>
      </styled.Wrapper>
    </styled.Container>
  );
};

export default observer(SignInPage);
