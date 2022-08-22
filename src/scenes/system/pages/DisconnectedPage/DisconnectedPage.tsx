import {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {useTheme} from 'styled-components';

import {SystemWideError} from 'ui-kit';

const DisconnectedPage: FC = () => {
  const theme = useTheme();
  const {t} = useTranslation();

  return (
    <SystemWideError
      text={[t('systemWideError.loadedInAnotherTab'), t('systemWideError.switchToThatTab')]}
      theme={theme}
    />
  );
};

export default DisconnectedPage;
