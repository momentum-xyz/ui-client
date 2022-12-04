import React, {FC, useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {SinusBox} from 'ui-kit';

import {CreateOdysseyForm, ChoiceYourWallet, CongratulationsBox} from './components';
import * as styled from './SignInAccountPage.styled';

const SignInAccountPage: FC = () => {
  const {authStore, nftStore} = useStore();

  const history = useHistory();

  const fetchTokenByWallet = useCallback(async () => {
    await authStore.fetchTokenByWallet();
  }, [authStore]);

  return (
    <styled.Container>
      <styled.Wrapper>
        <styled.Boxes>
          <SinusBox />
          {!authStore.token && (
            <ChoiceYourWallet
              walletOptions={nftStore.accountOptions}
              wallet={authStore.wallet}
              isConnectDisabled={authStore.isPending}
              onSelectAddress={authStore.selectWallet}
              onConnect={fetchTokenByWallet}
            />
          )}

          {!!authStore.token && (
            <>
              <CongratulationsBox />
              <SinusBox />
              <CreateOdysseyForm onCreate={() => history.push(ROUTES.birth)} />
            </>
          )}
        </styled.Boxes>
      </styled.Wrapper>
    </styled.Container>
  );
};

export default observer(SignInAccountPage);
