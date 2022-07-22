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
  height: 100%;
  display: flex;
  min-height: 0;
  padding: 0 10px;
  margin-top: 10px;
`;

export const DashboardContainer = styled.div`
  display: flex;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  pointer-events: auto;

  padding: 1px;
  width: 100%;
  height: 100%;
  align-items: stretch;
  gap: 8px;
`;
