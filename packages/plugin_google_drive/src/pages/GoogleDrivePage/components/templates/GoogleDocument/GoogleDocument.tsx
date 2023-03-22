import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';

import * as styled from './GoogleDocument.styled';

interface PropsInterface {
  documentUrl: string;
}

const GoogleDocument: FC<PropsInterface> = ({documentUrl}) => {
  const {t} = useI18n();

  return (
    <styled.Wrapper data-testid="GoogleDocument-test">
      <iframe
        title={t('plugin_gd.labels.googleDrive')}
        width="800"
        height="500"
        src={documentUrl}
        frameBorder="0"
        scrolling="no"
        allowFullScreen
        style={{width: '100%', height: '100%'}}
      />
    </styled.Wrapper>
  );
};

export default observer(GoogleDocument);
