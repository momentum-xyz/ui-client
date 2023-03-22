import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';

import * as styled from './MiroBoard.styled';

interface PropsInterface {
  miroUrl: string;
}

const MiroBoard: FC<PropsInterface> = ({miroUrl}) => {
  const {t} = useI18n();

  return (
    <styled.Wrapper data-testid="MiroBoard-test">
      <iframe
        title={t('plugin_miro.labels.miro')}
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
