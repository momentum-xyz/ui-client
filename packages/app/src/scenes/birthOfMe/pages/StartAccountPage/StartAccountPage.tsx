import React, {FC, useCallback, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {SinusBox} from 'ui-kit';
import {CreateOdysseyForm, ChoiceYourWallet, CongratulationsBox} from 'scenes/birthOfMe/components';

import * as styled from './StartAccountPage.styled';

const StartAccountPage: FC = () => {
  const {authStore} = useStore();

  const [token, setToken] = useState<string | null>(null);

  const history = useHistory();

  useEffect(() => {
    authStore.init();
  }, [authStore]);

  const signChallengeAndGetToken = useCallback(async () => {
    const token = await authStore.getTokenByWallet();
    setToken(token);

    alert(token);
  }, [authStore]);

  return (
    <styled.Container>
      <styled.Wrapper>
        <styled.Boxes>
          <SinusBox />
          {!token && (
            <ChoiceYourWallet
              walletOptions={authStore.accountOptions}
              wallet={authStore.wallet}
              isConnectDisabled={authStore.isPending}
              onSelectAddress={authStore.selectWallet}
              onConnect={signChallengeAndGetToken}
            />
          )}

          {!!token && (
            <>
              <CongratulationsBox />
              <SinusBox />
              <CreateOdysseyForm onCreate={() => history.push(ROUTES.birthOfMe.birth)} />
            </>
          )}
        </styled.Boxes>
      </styled.Wrapper>
    </styled.Container>
  );
};

export default observer(StartAccountPage);
