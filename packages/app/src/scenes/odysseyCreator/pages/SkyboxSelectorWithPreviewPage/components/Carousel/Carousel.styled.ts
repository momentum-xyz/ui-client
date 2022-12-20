import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  pointer-events: all;
`;

export const ButtonHolder = styled.div`
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.2)};
  }
`;
