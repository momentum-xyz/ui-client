import React, {FC} from 'react';
import {t} from 'i18next';
import {PropsWithThemeInterface} from '@momentum/ui-kit';

import {SvgButton, Text, Tooltip} from 'ui-kit';

import * as styled from './PageTopBar.styled';

interface PropsInterface extends PropsWithThemeInterface {
  title: string;
  subtitle?: string;
  onClose?: () => void;
  actions?: React.ReactElement;
}

const PageTopBar: FC<PropsInterface> = (props) => {
  return (
    <styled.Container data-testid="PageTopBar-test">
      <styled.Titles>
        <styled.Title>
          <Text
            text={props.title}
            transform="uppercase"
            weight="bold"
            theme={props.theme}
            size="xl"
            isMultiline={false}
          />
        </styled.Title>
        {props.subtitle && (
          <styled.SubTitle>
            <Text
              text={`/ ${props.subtitle}`}
              transform="uppercase"
              theme={props.theme}
              size="xl"
              isMultiline={false}
            />
          </styled.SubTitle>
        )}
      </styled.Titles>
      <styled.ChildrenContainer>{props.children}</styled.ChildrenContainer>
      <styled.Actions>
        {props.actions}
        {props.onClose && (
          <Tooltip label={t('tooltipTitles.close')} placement="bottom">
            <SvgButton iconName="close" size="medium-large" onClick={() => props.onClose?.()} />
          </Tooltip>
        )}
      </styled.Actions>
    </styled.Container>
  );
};

export default PageTopBar;
