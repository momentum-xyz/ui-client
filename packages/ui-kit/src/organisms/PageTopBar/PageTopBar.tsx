import React, {FC, ReactNode} from 'react';
import {t} from 'i18next';

import {PropsWithThemeInterface} from '../../interfaces';
import {Text, Tooltip} from '../../atoms';
import {SvgButton} from '../../molecules';

import * as styled from './PageTopBar.styled';

interface PropsInterface extends PropsWithThemeInterface {
  title: string;
  subtitle?: string;
  onClose?: () => void;
  actions?: React.ReactElement;
  children?: ReactNode;
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
          <Tooltip label={t('tooltipTitles.close') as string} placement="bottom">
            <SvgButton iconName="close" size="medium-large" onClick={() => props.onClose?.()} />
          </Tooltip>
        )}
      </styled.Actions>
    </styled.Container>
  );
};

export default PageTopBar;
