import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-columns: auto auto auto;
  height: 100%;
  gap: 10px;
`;

export const LeftSection = styled.div`
  padding: var(--menu-padding) 0 0 var(--menu-padding);
  display: flex;
`;

export const CenterSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const RightSection = styled.div`
  padding: var(--menu-padding) var(--menu-padding) 0 0;
  display: flex;
  justify-content: end;
`;

export const Widget = styled.div`
  max-height: calc(100vh - var(--menu-height) - var(--menu-padding) * 3);
  pointer-events: all;
`;
