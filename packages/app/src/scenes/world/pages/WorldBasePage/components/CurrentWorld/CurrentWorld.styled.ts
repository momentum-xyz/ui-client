import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  gap: 10px;
`;

export const Hexagons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const BlankHexagons = styled.div`
  display: flex;
  flex-direction: column;
  height: 112px;
`;

export const BlankHexagon1 = styled.div`
  margin: 0 -10px 0 0;
  text-align: right;
`;

export const BlankHexagon2 = styled.div`
  margin: 0 10px 0 0;
  text-align: left;
`;

export const BlankHexagon3 = styled.div`
  margin: 0 -10px 0 0;
  text-align: right;
`;

export const BlankHexagonLast = styled.div`
  margin: 0 -10px 0 0;
  text-align: right;
`;

export const Content = styled.div``;

export const Name = styled.div`
  display: flex;
  height: 56px;
  justify-content: right;
  align-items: center;
  font-size: var(--font-size-xxxl);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  text-align: right;
  font-weight: 700;
`;

export const Information = styled.div`
  padding: 0 0 0 16px;
  display: flex;
  height: 112px;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
`;

export const Label = styled.div`
  display: flex;
  height: 56px;
  justify-content: right;
  align-items: center;
`;
