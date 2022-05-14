import styled from 'styled-components';

export const Background = styled.div`
  display: flex;
  position: absolute;
  width: 100%;
  height: 100vh;
  background-size: cover;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

export const Networks = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 40px;
  align-items: center;
  justify-content: center;
`;
