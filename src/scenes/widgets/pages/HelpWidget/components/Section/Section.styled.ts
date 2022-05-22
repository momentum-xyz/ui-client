import styled from 'styled-components';
import {rgba} from 'polished';

import {IconSvg} from 'ui-kit';

export const Container = styled.div`
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.3)};
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 0 20px;
`;

export const BottomContainer = styled.div`
  &.hide {
    display: none;
  }
`;

export const TopContanerChild = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 20px 0;
`;

export const DropDownIcon = styled(IconSvg)`
  cursor: pointer;
  &.expanded {
    transform: rotate(180deg);
  }
`;

export const TopContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

export const Border = styled.div`
  border: 0.5px solid ${(props) => props.theme.accent};
`;
