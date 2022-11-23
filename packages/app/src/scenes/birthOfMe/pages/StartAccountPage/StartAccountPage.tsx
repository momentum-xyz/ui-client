import React, {FC, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {SinusBox} from 'ui-kit';
import {JourneyForm, ChoiceYourWallet, CongratulationsBox} from 'scenes/birthOfMe/components';

import * as styled from './StartAccountPage.styled';

const StartAccountPage: FC = () => {
  const {birthOfMeStore} = useStore();
  const {signInStore} = birthOfMeStore;

  const [isAccount, setIsAccount] = useState<boolean>(false);

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
          {!isAccount && (
            <ChoiceYourWallet
              addresses={signInStore.accountOptions}
              selectedAddress={signInStore.selectedAddress}
              onSelectAddress={signInStore.selectAddress}
              onConnect={() => setIsAccount(true)}
            />
          )}

          {isAccount && (
            <>
              <CongratulationsBox />
              <SinusBox />
              <JourneyForm onCreate={() => history.push(ROUTES.explore)} />
            </>
          )}
        </styled.Boxes>
      </styled.Wrapper>
    </styled.Container>
  );
};

export default observer(StartAccountPage);
