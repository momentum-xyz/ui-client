import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {useTheme} from 'styled-components';

import {Button, Text} from 'ui-kit';

import * as styled from './ScreenChoice.styled';

interface PropsInterface {
  canShare: boolean;
  isSettingUp: boolean;
  startScreenShare: () => void;
}

const ScreenChoice: FC<PropsInterface> = ({canShare, isSettingUp, startScreenShare}) => {
  const {t} = useTranslation();
  const theme = useTheme();

  return (
    <styled.Wrapper>
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
