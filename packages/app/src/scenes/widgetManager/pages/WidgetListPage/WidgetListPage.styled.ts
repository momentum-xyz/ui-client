import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-columns: auto auto auto;
  height: 100%;
  gap: 10px;
`;

export const LeftSection = styled.div`
  display: flex;
`;

export const CenterSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const RightSection = styled.div`
  display: flex;
  justify-content: end;
`;

export const Widget = styled.div`
  pointer-events: all;
`;
