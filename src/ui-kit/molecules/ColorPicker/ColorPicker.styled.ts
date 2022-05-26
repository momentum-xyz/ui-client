import styled from 'styled-components';
import {rgba} from 'polished';

export const Color = styled.div`
  width: 13px;
  height: 13px;
  border-radius: 100%;
  background: ${(props) => props.color};
  padding: 4px;
  outline-offset: 1px;

  &.selected {
    outline: 1px solid ${(props) => props.theme.accent};
  }
`;

export const ColorContainer = styled.div`
  display: flex;
  margin-left: 10px;

  ${Color} ~ ${Color} {
    margin-left: 7px;
  }
`;

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 11px;
  background: ${(props) =>
    props.theme.bg === '#FFFFFF' ? rgba(0, 0, 0, 0.1) : rgba(255, 255, 255, 0.1)};
  padding: 7px 15px 7px 8px;
`;
