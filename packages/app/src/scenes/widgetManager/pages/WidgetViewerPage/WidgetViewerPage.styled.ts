import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  height: 100%;
  gap: 10px;
`;

export const LeftSection = styled.div`
  padding: var(--menu-padding) 0 0 var(--menu-padding);
  display: flex;
`;

export const RightSection = styled.div`
  padding: var(--menu-padding) var(--menu-padding) 0 0;
  display: flex;
  justify-content: end;
`;

export const Widget = styled.div``;
