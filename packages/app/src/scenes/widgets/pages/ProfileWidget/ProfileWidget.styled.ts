import styled from 'styled-components';

export const Header = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

export const Name = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export const Body = styled.div`
  display: flex;
  overflow: hidden;
  width: 280px;
  min-height: 150px;
  max-height: calc(100vh - 125px);
  margin-top: 10px;
`;
