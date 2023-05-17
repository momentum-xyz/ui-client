import {FC, useMemo} from 'react';
import {useI18n} from '@momentum-xyz/core';

import {Button, IconSvg} from '../../atoms';
import background from '../../static/images/bg.png';

import * as styled from './SystemWideError.styled';

export interface SystemWideErrorPropsInterface {
  text: string | string[] | null;
  showRefreshButton?: boolean;
}

const SystemWideError: FC<SystemWideErrorPropsInterface> = ({text, showRefreshButton}) => {
  const {t} = useI18n();

  const texts = useMemo(() => {
    return Array.isArray(text) ? text : [text];
  }, [text]);

  const handleRefresh = () => {
    document.location = '/';
  };

  return (
    <styled.Background background={background}>
      <styled.PanelContent>
        <styled.IconContainer>
          <IconSvg name="alert" size="xxl" isWhite />
        </styled.IconContainer>
        <styled.InnerContent>
          {texts.map((item, index) => (
            <span key={index}>{item}</span>
          ))}
          {showRefreshButton && (
            <styled.ActionsContainer>
              <Button label={t('actions.refresh')} onClick={handleRefresh} />
            </styled.ActionsContainer>
          )}
        </styled.InnerContent>
      </styled.PanelContent>
    </styled.Background>
  );
};

export default SystemWideError;
