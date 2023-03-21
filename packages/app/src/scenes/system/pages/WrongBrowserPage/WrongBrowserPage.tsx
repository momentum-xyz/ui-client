import React, {FC} from 'react';
import {useTheme} from 'styled-components';
import {useI18n} from '@momentum-xyz/core';

import {SystemWideError} from 'ui-kit';

const WrongBrowserPage: FC = () => {
  const {t} = useI18n();
  const theme = useTheme();
  return (
    <SystemWideError
      text={[t('wrongBrowser.title'), t('wrongBrowser.browserList')]}
      theme={theme}
    />
  );
};

export default WrongBrowserPage;
