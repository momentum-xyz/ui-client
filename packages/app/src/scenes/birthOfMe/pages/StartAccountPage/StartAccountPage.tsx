import React, {FC, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {
  SinusBox,
  JourneyForm,
  ChoiceYourWallet,
  CongratulationsBox
} from 'scenes/birthOfMe/components';

import * as styled from './StartAccountPage.styled';

const StartAccountPage: FC = () => {
  const {birthOfMeStore} = useStore();

  const [isAccount, setIsAccount] = useState<boolean>(false);

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
              <JourneyForm />
            </>
          )}
        </styled.Boxes>
      </styled.Wrapper>
    </styled.Container>
  );
};

export default observer(StartAccountPage);
