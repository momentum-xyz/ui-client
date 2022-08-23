import styled from 'styled-components';

// export const Container = styled.ul`
//   margin: 0 var(--meeting-size) 0 0;
//   display: flex;
//   width: 100%;
// `;

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
