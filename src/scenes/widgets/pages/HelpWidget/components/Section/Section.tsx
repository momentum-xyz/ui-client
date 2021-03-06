import React from 'react';
import {observer} from 'mobx-react-lite';
import cn from 'classnames';
import {t} from 'i18next';

import {Heading, IconSvg, Text} from 'ui-kit';

import * as styled from './Section.styled';

export interface SectionPropsInterface {
  icon: IconName;
  name: string;
  expanded: boolean;
  onExpandToggle: () => void;
  withBorder?: boolean;
}

const Section: React.FC<SectionPropsInterface> = ({
  icon,
  name,
  expanded,
  onExpandToggle,
  withBorder = true,
  children
}) => {
  return (
    <styled.Container>
      <styled.TopContainer onClick={onExpandToggle}>
        <styled.TopContanerChild>
          <IconSvg name={icon} size="large" />
          <Heading label={name} align="left" type="h1" weight="bold" transform="uppercase" />
        </styled.TopContanerChild>
        <styled.TopContanerChild>
          <Text
            text={expanded ? t('helpSection.closeLabel') : t('helpSection.openLabel')}
            align="left"
            weight="normal"
            size="xs"
          />
          <styled.DropDownIcon
            name="chevron"
            size="normal"
            isCustom
            onClick={onExpandToggle}
            className={cn({expanded})}
          />
        </styled.TopContanerChild>
      </styled.TopContainer>
      <styled.BottomContainer className={cn({hide: !expanded})}>
        {withBorder && <styled.Border />}
        {children}
      </styled.BottomContainer>
    </styled.Container>
  );
};

export default observer(Section);
