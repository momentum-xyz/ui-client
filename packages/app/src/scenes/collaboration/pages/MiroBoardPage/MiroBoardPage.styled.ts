import styled from 'styled-components';

export const Inner = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
  width: var(--space-page-width);
  height: 100%;
  overflow: hidden;
  pointer-events: auto;
`;

export const Container = styled.div`
  display: flex;
  height: 100%;
  min-height: 0;
  padding: 10px 0 0 0;
`;
