import styled from 'styled-components';

export const Container = styled.div`
  position: absolute;
  display: flex;
  gap: 10px;

  pointer-events: all;

  top: 10px;
  right: 10px;
  z-index: var(--dialog-z-index);
`;

export const BottomCenteredDock = styled.div`
  position: fixed;
  bottom: 50px;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  width: 20%;
  z-index: calc(var(--overlay-z-index) + 1);
  pointer-events: none;
`;
