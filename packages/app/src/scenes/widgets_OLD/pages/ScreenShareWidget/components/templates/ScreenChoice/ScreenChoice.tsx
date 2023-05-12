import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Button} from '@momentum-xyz/ui-kit-storybook';

import * as styled from './ScreenChoice.styled';

interface PropsInterface {
  canShare?: boolean;
  isSettingUp: boolean;
  startScreenShare: () => void;
}

const ScreenChoice: FC<PropsInterface> = ({canShare = true, isSettingUp, startScreenShare}) => {
  const {t} = useI18n();

  return (
    <styled.Wrapper data-testid="ScreenChoice-test">
      {isSettingUp ? (
        <styled.SettingUpContainer>
          {t('messages.preparingScreenSharing')}
        </styled.SettingUpContainer>
      ) : (
        <styled.Actions>
          {t('messages.noScreenSharing')}
          {canShare && (
            <Button
              variant="primary"
              label={t('actions.startScreenShare')}
              onClick={startScreenShare}
            />
          )}
        </styled.Actions>
      )}
    </styled.Wrapper>
  );
};

export default observer(ScreenChoice);
