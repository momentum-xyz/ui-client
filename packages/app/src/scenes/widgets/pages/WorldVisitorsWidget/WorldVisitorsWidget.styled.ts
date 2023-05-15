import styled from 'styled-components';

export const Container = styled.div`
  --scroll-offset: 205px;

  position: relative;
  display: flex;
`;

export const Content = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
`;

export const ScrollableContainer = styled.div`
  margin: 10px 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: calc(100vh - var(--scroll-offset));
  overflow: auto;
`;
