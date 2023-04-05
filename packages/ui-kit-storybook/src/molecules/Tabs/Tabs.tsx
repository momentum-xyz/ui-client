import {PropsWithChildren} from 'react';

import {IconNameType} from '../../types';
import {ButtonEllipse} from '../../atoms';

import * as styled from './Tabs.styled';

export interface TabInterface<T> {
  id: T;
  icon: IconNameType;
  label: string;
}

export interface TabsPropsInterface<T> {
  activeId?: T;
  tabList: TabInterface<T>[];
  onSelect?: (id: T) => void;
}

const Tabs = <T,>(props: PropsWithChildren<TabsPropsInterface<T>>) => {
  const {tabList, activeId, children, onSelect} = props;
  return (
    <styled.Inner data-testid="Tabs-test">
      <styled.Tabs>
        {tabList.map((tab, index) => (
          <ButtonEllipse
            key={`${tab.id}${index}`}
            icon={tab.icon}
            label={tab.label}
            isActive={tab.id === activeId}
            onClick={() => onSelect?.(tab.id)}
          />
        ))}
      </styled.Tabs>
      {children}
    </styled.Inner>
  );
};

export default Tabs;
