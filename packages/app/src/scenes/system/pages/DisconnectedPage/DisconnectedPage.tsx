import {FC} from 'react';
import {useTheme} from 'styled-components';
import {useI18n} from '@momentum-xyz/core';

import {SystemWideError} from 'ui-kit';

const DisconnectedPage: FC = () => {
  const theme = useTheme();
  const {t} = useI18n();

  return (
    <SystemWideError
      text={[t('systemMessages.loadedInAnotherTab'), t('systemMessages.switchToThatTab')]}
      theme={theme}
    />
  );
};

export default DisconnectedPage;
