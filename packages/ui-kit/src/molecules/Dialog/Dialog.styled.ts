import styled from 'styled-components';
import {rgba} from 'polished';

export const Modal = styled.div`
  position: absolute;
  display: flex;
  width: 100vw;
  height: 100vh;
  font-size: var(--font-size-m);
  color: ${(props) => props.theme.text};
  pointer-events: all;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  z-index: var(--dialog-z-index);

  &.showBackground {
    background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.2)};
  }
`;

export const Container = styled.div`
  background-color: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.6)};
  border-radius: 4px;
  pointer-events: all;
`;

export const Header = styled.div`
  padding: 0 12px 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  height: 40px;
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;
  background-color: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.6)};
  color: ${(props) => props.theme.accentText};
  font-size: var(--font-size-l);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2em;

  svg {
    color: ${(props) => props.theme.accentText};
  }
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Content = styled.div`
  padding: 10px;
`;

export const Buttons = styled.div`
  padding: 0 10px 10px 10px;
  display: flex;
  gap: 10px;
`;
