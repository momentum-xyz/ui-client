import cn from 'classnames';

import {IconNameType} from '../../types';
import {ButtonEllipse} from '../../atoms';

import * as styled from './Tabs.styled';

export interface TabInterface<T> {
  id: T;
  icon: IconNameType;
  label: string;
  disabled?: boolean;
}

export interface TabsPropsInterface<T> {
  activeId?: T;
  tabList: TabInterface<T>[];
  onSelect?: (id: T) => void;
  stickToTopRight?: boolean;
}

const Tabs = <T,>({tabList, activeId, onSelect, stickToTopRight}: TabsPropsInterface<T>) => {
  return (
    <styled.Tabs data-testid="Tabs-test" className={cn(stickToTopRight && 'stick-to-top-right')}>
      {tabList.map((tab, index) => (
        <ButtonEllipse
          key={`${tab.id}${index}`}
          icon={tab.icon}
          label={tab.label}
          isActive={tab.id === activeId}
          disabled={tab.disabled}
          onClick={() => onSelect?.(tab.id)}
        />
      ))}
    </styled.Tabs>
  );
};

export default Tabs;
