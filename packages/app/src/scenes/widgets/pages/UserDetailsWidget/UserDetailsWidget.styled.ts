import styled from 'styled-components';

export const Container = styled.div`
  --scroll-offset: 430px;
`;

export const Wrapper = styled.div`
  padding: 0;
`;

export const GeneralScrollable = styled.div`
  margin: 0 10px;
  display: flex;
  height: calc(100vh - var(--scroll-offset));
  flex-direction: column;
  overflow: auto;
  gap: 10px;
`;
