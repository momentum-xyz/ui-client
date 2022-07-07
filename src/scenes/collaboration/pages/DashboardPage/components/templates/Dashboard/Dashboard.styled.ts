import styled from 'styled-components';

export const ColumnContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

export const RowContainer = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  flex-direction: column;
  gap: 8px;
`;

export const Content = styled.div`
  padding-bottom: 40px;
`;

export const Container = styled.div`
  display: flex;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  pointer-events: auto;
  margin-top: 10px;
  padding: 1px;
  width: 100%;
  height: 100%;
  align-items: stretch;
  gap: 8px;
`;
