import {FC, useState} from 'react';

import {IconButton} from '../../atoms';

import * as styled from './CollapsibleSection.styled';

export interface CollapsibleSectionPropsInterface {
  initialCollapsed?: boolean;
  disabled?: boolean;
  title: string;
  children?: React.ReactNode;
}

export const CollapsibleSection: FC<CollapsibleSectionPropsInterface> = ({
  initialCollapsed = true,
  disabled,
  title,
  children
}) => {
  const [collapsed = initialCollapsed, setCollapsed] = useState<boolean>();

  return (
    <styled.Container data-testid="CollapsibleSection-test">
      <styled.Head>
        <styled.Title disabled={disabled}>{title}</styled.Title>
        <IconButton
          isWhite
          isDisabled={disabled}
          name={collapsed ? 'add_large' : 'subtract_large'}
          onClick={() => setCollapsed(!collapsed)}
        />
      </styled.Head>
      <styled.Content collapsed={collapsed}>{children}</styled.Content>
    </styled.Container>
  );
};
