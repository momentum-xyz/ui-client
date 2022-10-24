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
  margin-top: 10px;
`;

export const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  overflow-y: scroll;
  pointer-events: auto;

  padding: 1px;
  width: 100%;
  height: 100%;
  align-items: stretch;
  gap: 8px;
`;
