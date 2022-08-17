import {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {useTheme} from 'styled-components';

import {IconSvg, PanelLayout, Text} from 'ui-kit';
import background from 'static/images/bg.png';

import * as styled from './SystemWideError.styled';

interface PropsInterface {
  isMaintenance?: boolean;
  isDisconnected?: boolean;
}

const SystemWideError: FC<PropsInterface> = ({isMaintenance, isDisconnected}) => {
  const theme = useTheme();
  const {t} = useTranslation();

  return (
    <styled.Background background={background} data-testid="DisconnectPage-test">
      <PanelLayout isBodyExtendingToEdges theme={theme}>
        <styled.PanelContent>
          <styled.IconContainer>
            <IconSvg name="alert" size="extra-large" theme={theme} isWhite />
          </styled.IconContainer>
          <styled.TextContainer>
            {isMaintenance && (
              <Text theme={theme} size="l" text={t('systemWideError.underMaintenance')} />
            )}
            {isDisconnected && (
              <>
                <Text
                  text={t('systemWideError.loadedInAnotherTab')}
                  size="m"
                  weight="light"
                  theme={theme}
                />
                <Text
                  text={t('systemWideError.switchToThatTab')}
                  size="m"
                  weight="light"
                  theme={theme}
                />
              </>
            )}
          </styled.TextContainer>
        </styled.PanelContent>
      </PanelLayout>
    </styled.Background>
  );
};

export default SystemWideError;
