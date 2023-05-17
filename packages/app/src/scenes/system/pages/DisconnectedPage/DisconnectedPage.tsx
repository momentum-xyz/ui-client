import {FC} from 'react';
import {useI18n} from '@momentum-xyz/core';
import {SystemWideError} from '@momentum-xyz/ui-kit-storybook';

const DisconnectedPage: FC = () => {
  const {t} = useI18n();

  return (
    <SystemWideError
      text={[t('systemMessages.loadedInAnotherTab'), t('systemMessages.switchToThatTab')]}
    />
  );
};

export default DisconnectedPage;
