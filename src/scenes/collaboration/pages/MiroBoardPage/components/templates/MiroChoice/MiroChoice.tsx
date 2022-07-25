import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {Button} from 'ui-kit';

import * as styled from './MiroChoice.styled';

interface PropsInterface {
  isAdmin: boolean;
  pickBoard: () => void;
}

const MiroChoice: FC<PropsInterface> = ({isAdmin, pickBoard}) => {
  const {t} = useTranslation();

  return (
    <styled.Wrapper>
      {isAdmin ? (
        <>
          <h2 className="font-bold">Your team does not have a Miro board yet</h2>
          <Button label={t('actions.chooseBoard')} variant="primary" onClick={pickBoard} />
        </>
      ) : (
        <h2 className="font-bold">This team does not have a Miro board yet</h2>
      )}
    </styled.Wrapper>
  );
};

export default observer(MiroChoice);
