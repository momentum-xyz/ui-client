import {FC} from 'react';
import {useTheme} from 'styled-components';

import {SystemWideError} from 'ui-kit';

const DisconnectedPage: FC = () => {
  const theme = useTheme();
  return (
    <SystemWideError
      text={['systemWideError.loadedInAnotherTab', 'systemWideError.switchToThatTab']}
      theme={theme}
    />
  );
};

export default DisconnectedPage;
