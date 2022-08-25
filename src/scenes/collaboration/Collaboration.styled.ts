import styled from 'styled-components';

export const Container = styled.ul`
  display: flex;
  width: 100%;
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
  // background: #ff000070;
`;
