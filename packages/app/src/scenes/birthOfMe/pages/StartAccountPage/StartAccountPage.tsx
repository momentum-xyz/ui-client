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

  const [isAccount, setIsAccount] = useState<boolean>(false);

  const history = useHistory();

  useEffect(() => {
    birthOfMeStore.init();
  }, [birthOfMeStore]);

  return (
    <styled.Container>
      <styled.Wrapper>
        <styled.Boxes>
          <SinusBox />
          {!isAccount && <ChoiceYourWallet onConnect={() => setIsAccount(true)} />}

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
