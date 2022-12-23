import styled from 'styled-components';

export const Canvas = styled.canvas`
  pointer-events: all;
  width: 100%;
  height: 100%;
  border-radius: 4px;

  &.background {
    background: linear-gradient(to bottom, #b5bdc8 0%, #828c95 36%, #28343b 100%);
  }
`;

export const ProgressBarHolder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 20%;
`;
