import {FC, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {useTheme} from 'styled-components';

import {Button, IconSvg, PanelLayout, Text} from 'ui-kit';
import background from 'static/images/bg.png';

import * as styled from './SystemWideError.styled';

interface PropsInterface {
  text: string | string[];
  showRefreshButton?: boolean;
}

const SystemWideError: FC<PropsInterface> = ({text, showRefreshButton}) => {
  const theme = useTheme();
  const {t} = useTranslation();

  const texts = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

  const handleRefresh = () => {
    window.location.href = '/';
  };

  return (
    <styled.Background background={background}>
      <PanelLayout isBodyExtendingToEdges theme={theme}>
        <styled.PanelContent>
          <styled.IconContainer>
            <IconSvg name="alert" size="extra-large" theme={theme} isWhite />
          </styled.IconContainer>
          <styled.InnerContent>
            {texts.map((text) => (
              <Text text={t(text)} key={text} size="m" weight="light" theme={theme} />
            ))}
            {showRefreshButton && (
              <styled.ActionsContainer>
                <Button label={t('actions.refresh')} onClick={handleRefresh} />
              </styled.ActionsContainer>
            )}
          </styled.InnerContent>
        </styled.PanelContent>
      </PanelLayout>
    </styled.Background>
  );
};

export default SystemWideError;
