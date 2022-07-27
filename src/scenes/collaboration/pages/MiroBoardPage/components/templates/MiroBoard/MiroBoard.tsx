import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import * as styled from './MiroBoard.styled';

interface PropsInterface {
  miroUrl: string;
}

const MiroBoard: FC<PropsInterface> = ({miroUrl}) => {
  const {t} = useTranslation();

  return (
    <styled.Wrapper>
      <iframe
        title={t('labels.miro')}
        width="800"
        height="500"
        src={miroUrl}
        frameBorder="0"
        scrolling="no"
        allowFullScreen
        style={{width: '100%', height: '100%'}}
      />
    </styled.Wrapper>
  );
};

export default observer(MiroBoard);
