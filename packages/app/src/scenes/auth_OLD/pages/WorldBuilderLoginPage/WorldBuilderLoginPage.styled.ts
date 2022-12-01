import styled from 'styled-components';

export const Background = styled.div`
  display: flex;
  position: absolute;
  width: 100%;
  height: 100vh;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

export const Networks = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  justify-content: center;
`;

export const WorldBuilderError = styled.div`
  position: absolute;
  bottom: -70px;
  left: 0;
  right: 0;
  text-align: center;
  font-weight: 500;
  color: ${(props) => props.theme.accentDanger};
  white-space: pre-line;
`;

export const RemarksContainer = styled.div`
  position: absolute;
  bottom: -70px;
  right: 0;
  left: 0;
`;
