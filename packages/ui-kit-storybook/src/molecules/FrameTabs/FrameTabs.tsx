import {FC, PropsWithChildren} from 'react';

import {IconNameType} from '../../types';
import {ButtonEllipse} from '../../atoms';

import * as styled from './FrameTabs.styled';

export interface FrameTabInterface {
  id: string;
  icon: IconNameType;
  label: string;
}

export interface FrameTabsPropsInterface {
  selectedId?: string;
  tabList: FrameTabInterface[];
  onSelect?: (id: string) => void;
}

const FrameTabs: FC<PropsWithChildren<FrameTabsPropsInterface>> = ({
  tabList,
  selectedId,
  children,
  onSelect
}) => {
  return (
    <styled.Container data-testid="FrameTabs-test">
      <styled.Inner>
        <styled.Steps>
          {tabList.map((tab) => (
            <ButtonEllipse
              key={tab.id}
              icon={tab.icon}
              label={tab.label}
              isActive={tab.id === selectedId}
              onClick={() => onSelect?.(tab.id)}
            />
          ))}
        </styled.Steps>
        {children}
      </styled.Inner>
    </styled.Container>
  );
};

export default FrameTabs;
