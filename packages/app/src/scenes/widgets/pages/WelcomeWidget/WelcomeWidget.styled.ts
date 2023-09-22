import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  height: calc(100vh - 90px);
  justify-content: center;
  align-items: center;
`;

export const Hexagons = styled.div`
  position: relative;
  height: 660px;
`;

export const TopHexagons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

export const BottomHexagon = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  width: 100%;
  top: 292px;
`;

export const CloseButton = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: all;
  left: 0;
  right: 0;
  top: 35px;
`;
