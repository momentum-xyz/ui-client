import {FC, useMemo} from 'react';
import {useI18n} from '@momentum-xyz/core';
import {PropsWithThemeInterface, Button, IconSvg, PanelLayout, Text} from '@momentum-xyz/ui-kit';

import background from 'static/images/bg.png';

import * as styled from './SystemWideError.styled';

interface PropsInterface extends PropsWithThemeInterface {
  text: string | string[] | null;
  showRefreshButton?: boolean;
}

const SystemWideError: FC<PropsInterface> = ({text, showRefreshButton}) => {
  const {t} = useI18n();

  const texts = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <styled.Background background={background}>
      <PanelLayout isBodyExtendingToEdges>
        <styled.PanelContent>
          <styled.IconContainer>
            <IconSvg name="alert" size="extra-large" isWhite />
          </styled.IconContainer>
          <styled.InnerContent>
            {texts.map((text) => (
              <Text text={text} key={text} size="m" weight="light" />
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
