import {FC} from 'react';

import {SystemWideError} from 'ui-kit';

const DisconnectedPage: FC = () => {
  return (
    <SystemWideError
      text={['systemWideError.loadedInAnotherTab', 'systemWideError.switchToThatTab']}
    />
  );
};

export default DisconnectedPage;
