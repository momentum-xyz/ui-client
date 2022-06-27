import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  pointer-events: auto;

  ::-webkit-scrollbar {
    display: none;
  }
`;

export const Content = styled.div`
  padding-bottom: 40px;
`;

export const CoreContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: stretch;
  gap: 4px;
`;
