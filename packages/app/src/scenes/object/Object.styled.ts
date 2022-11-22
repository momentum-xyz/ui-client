import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  width: 100%;
  gap: 10px;
  margin: 10px;
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
