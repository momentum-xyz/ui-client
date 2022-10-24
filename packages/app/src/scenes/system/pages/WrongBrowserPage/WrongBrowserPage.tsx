import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {useTheme} from 'styled-components';

import {SystemWideError} from 'ui-kit';

const WrongBrowserPage: FC = () => {
  const {t} = useTranslation();
  const theme = useTheme();
  return (
    <SystemWideError
      text={[t('wrongBrowser.title'), t('wrongBrowser.browserList')]}
      theme={theme}
    />
  );
};

export default WrongBrowserPage;
