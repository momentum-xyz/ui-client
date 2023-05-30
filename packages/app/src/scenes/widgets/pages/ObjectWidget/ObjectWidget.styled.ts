import styled from 'styled-components';

export const Container = styled.div`
  position: absolute;
  display: flex;
  gap: 10px;
  top: 10px;
  right: 10px;
  z-index: var(--dialog-z-index);
`;

export const Wrapper = styled.div`
  position: relative;
  padding: 10px 0 16px 0;
`;

export const Tabs = styled.div`
  position: absolute;
  display: flex;
  justify-content: flex-end;
  top: -2px;
  right: 10px;
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
