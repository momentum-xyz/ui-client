import {FC, PropsWithChildren, ReactNode, useState} from 'react';

import {ObjectTopBar} from '../../templates';

import * as styled from './WindowPanel.styled';

interface PropsInterface {
  dataTestId?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  onClose?: () => void;
  initialIsExpanded?: boolean;
  onToggleExpand?: (isExpanded: boolean) => void;
}

const WindowPanel: FC<PropsWithChildren<PropsInterface>> = ({
  dataTestId,
  children,
  title,
  subtitle,
  actions,
  initialIsExpanded = false,
  onToggleExpand,
  onClose
}) => {
  const [isExpanded, setIsExpanded] = useState(initialIsExpanded);

  return (
    <styled.Container data-testid={dataTestId} className={isExpanded ? 'expanded' : undefined}>
      <ObjectTopBar
        title={title}
        subtitle={subtitle}
        isExpanded={isExpanded}
        onToggleExpand={() => {
          const newVal = !isExpanded;
          setIsExpanded(newVal);
          onToggleExpand?.(newVal);
        }}
        onClose={onClose}
      >
        {actions}
      </ObjectTopBar>
      <styled.Content>{children}</styled.Content>
    </styled.Container>
  );
};

export default WindowPanel;
