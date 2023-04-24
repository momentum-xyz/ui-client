import {rgba} from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  pointer-events: all;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 10px;
`;

export const Body = styled.div`
  display: flex;
  flex-grow: 1;
  overflow: hidden;
`;

export const Separator = styled.div`
  height: 1px;
  width: 100%;
  background: ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.4)};
  margin: 20px 0;
`;
