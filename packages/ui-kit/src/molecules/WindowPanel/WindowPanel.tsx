import {FC, PropsWithChildren, ReactNode, useState} from 'react';

import {ObjectTopBar} from '../../templates';

import * as styled from './WindowPanel.styled';

interface PropsInterface {
  dataTestId?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  onClose?: () => void;
}

const WindowPanel: FC<PropsWithChildren<PropsInterface>> = ({
  dataTestId,
  children,
  title,
  subtitle,
  actions,
  onClose
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <styled.Container data-testid={dataTestId} className={isExpanded ? 'expanded' : undefined}>
      <ObjectTopBar
        title={title}
        subtitle={subtitle}
        isExpanded={isExpanded}
        onToggleExpand={() => setIsExpanded((isExpanded) => !isExpanded)}
        onClose={onClose}
      >
        {actions}
      </ObjectTopBar>
      <styled.Content>{children}</styled.Content>
    </styled.Container>
  );
};

export default WindowPanel;
