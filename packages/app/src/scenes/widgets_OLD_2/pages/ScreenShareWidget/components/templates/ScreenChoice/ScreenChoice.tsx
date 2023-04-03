import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {Button, Text} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import * as styled from './ScreenChoice.styled';

interface PropsInterface {
  canShare?: boolean;
  isSettingUp: boolean;
  startScreenShare: () => void;
}

const ScreenChoice: FC<PropsInterface> = ({canShare = true, isSettingUp, startScreenShare}) => {
  const {t} = useI18n();
  const theme = useTheme();

  return (
    <styled.Wrapper data-testid="ScreenChoice-test">
      {isSettingUp ? (
        <styled.SettingUpContainer>
          <Text text={`${t('messages.preparingScreenSharing')}...`} theme={theme} size="s" />
        </styled.SettingUpContainer>
      ) : (
        <styled.Actions>
          <Text text={t('messages.noScreenSharing')} theme={theme} size="s" />
          {canShare && (
            <Button
              theme={theme}
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
