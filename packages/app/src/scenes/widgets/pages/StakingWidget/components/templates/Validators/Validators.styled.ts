import styled from 'styled-components';
import {IconSvg} from '@momentum-xyz/ui-kit';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 100%;
`;

export const ListContainer = styled.div`
  flex: 1 0 auto;
  display: flex;
  max-height: 445px;
  align-items: start;
  justify-content: center;
  z-index: 1;
`;

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  z-index: 2;
`;

export const ToggleContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  justify-content: center;
`;

export const Legend = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  justify-content: center;
`;

export const LegendItem = styled.div`
  display: flex;
  font-size: var(--font-size-xs);
  color: ${(props) => props.theme.text};

  :not(&.tooltip) {
    z-index: 1;
  }

  &.tooltip {
    z-index: 2;
  }
`;

export const HeaderSvg = styled(IconSvg)`
  margin-right: 5px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const SortInfo = styled.ol`
  text-align: left;
`;
