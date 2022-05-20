import styled from 'styled-components';

export const Background = styled.div<{background: string}>`
  display: flex;
  position: absolute;
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-image: url(${(props) => props.background});
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

export const Networks = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  justify-content: center;
`;

export const SessionExpired = styled.div`
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
  font-weight: 500;
  color: ${(props) => props.theme.accentDanger};
`;
