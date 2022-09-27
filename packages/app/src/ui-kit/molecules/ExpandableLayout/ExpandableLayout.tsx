import React, {FC} from 'react';
import cn from 'classnames';
import {Heading, PropsWithThemeInterface} from '@momentum/ui-kit';

import {IconSvg} from 'ui-kit/atoms';
import {ComponentSizeInterface} from 'ui-kit/interfaces';

import * as styled from './ExpandableLayout.styled';

interface ExpandableLayoutPropsInterface extends PropsWithThemeInterface {
  iconName: IconNameType;
  name: string;
  fullHeight?: boolean;
  isExpanded: boolean;
  setExpand: (isExpanded: boolean) => void;
  size?: ComponentSizeInterface;
}

const ExpandableLayout: FC<ExpandableLayoutPropsInterface> = ({
  iconName,
  name,
  fullHeight = false,
  isExpanded,
  setExpand,
  children,
  size
}) => {
  return (
    <styled.Container
      data-testid="ExpandableLayout-test"
      className={cn(fullHeight && 'fullHeight', isExpanded && 'expanded')}
      {...size}
    >
      <styled.ToggleHeader onClick={() => setExpand(!isExpanded)}>
        <styled.ToggleHeaderInfo>
          <IconSvg name={iconName} size="medium" />
          <Heading label={name} type="h4" />
        </styled.ToggleHeaderInfo>
        <styled.ToggleContainer className={cn(isExpanded && 'expanded')}>
          <styled.ChevronIconSvg name="chevron" size="medium" />
        </styled.ToggleContainer>
      </styled.ToggleHeader>
      {isExpanded && children}
    </styled.Container>
  );
};

export default ExpandableLayout;
