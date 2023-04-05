import {rgba} from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.75)};
  border-radius: 10px;
  overflow: hidden;
  width: 280px;
  max-height: 584px;
  height: 100%;

  display: flex;
  flex-direction: column;
  pointer-events: all;
  z-index: var(--dialog-z-index);
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 4px;
  margin: 0 10px;
  border-bottom: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.1)};
`;

export const HeaderItemsGroup = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;
`;

export const Body = styled.div`
  flex-grow: 1;
  overflow: hidden;
`;
