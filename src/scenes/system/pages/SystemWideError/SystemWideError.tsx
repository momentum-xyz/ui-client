import {ComponentProps, FC} from 'react';
import {useTranslation} from 'react-i18next';
import {useTheme} from 'styled-components';

import {IconSvg, PanelLayout, Text} from 'ui-kit';
import background from 'static/images/bg.png';

import * as styled from './SystemWideError.styled';

const textStyleProps: ComponentProps<typeof Text> = {
  size: 'm',
  weight: 'light'
};

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
              <Text
                text={t('systemWideError.underMaintenance')}
                {...textStyleProps}
                theme={theme}
              />
            )}
            {isDisconnected && (
              <>
                <Text
                  text={t('systemWideError.loadedInAnotherTab')}
                  {...textStyleProps}
                  theme={theme}
                />
                <Text
                  text={t('systemWideError.switchToThatTab')}
                  {...textStyleProps}
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
