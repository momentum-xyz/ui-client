import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  max-height: 400px;
  z-index: 110;
  position: relative;
  background: ${(props) => props.theme.bg};
  &.hasBorder {
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
  }
`;
export const TextItem = styled.div`
  padding-left: 5px;
`;
export const IconItem = styled.span`
  justify-items: center;
  margin: auto 0;
  padding-right: 5px;
  cursor: pointer;
`;
export const Div = styled.div`
  display: flex;
  background: ${(props) => props.theme.bg};
  :hover {
    background: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.2)};
    &.hasBorder {
      border-radius: 0;
    }
  }
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  &.hasBorder {
    border-radius: 0;
  }
  justify-items: center;
  justify-content: space-between;
  padding: 5px;
`;

export const ListItem = styled.div`
  padding: 5px;
  :hover {
    background: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.2)};
  }
  cursor: pointer;
  padding-left: 10px;
`;
export const TokenContainer = styled.div`
  display: flex;
  justify-content: start;
  align-items: flex-start;
  padding-left: 5px;
`;
