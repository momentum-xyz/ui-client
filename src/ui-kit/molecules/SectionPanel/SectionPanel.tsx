import React, {FC} from 'react';
import cn from 'classnames';

import {PanelLayout, Heading, SvgButton} from 'ui-kit';

import * as styled from './SectionPanel.styled';

interface PropsInterface {
  title?: string;
  isCustom?: boolean;
  onAdd?: () => void;
}

const SectionPanel: FC<PropsInterface> = ({title, children, isCustom = false, onAdd}) => {
  return (
    <styled.Container
      className={cn(isCustom && 'SectionPanel-custom')}
      data-testid="SectionPanel-test"
    >
      <PanelLayout isCustom>
        <styled.Header>
          {title && <Heading label={title} type="h1" align="left" transform="uppercase" />}
          {onAdd && <SvgButton iconName="add" size="medium-large" onClick={onAdd} />}
        </styled.Header>
        <styled.Body>{children}</styled.Body>
      </PanelLayout>
    </styled.Container>
  );
};

export default SectionPanel;
