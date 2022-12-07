import styled from 'styled-components';

export const Container = styled.div`
  margin-top: 20px;
  display: flex;
  position: relative;
  flex-direction: column;
  height: 481px;
  gap: 20px;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  height: 100%;
  width: 100%;
`;

export const Item = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 5px;
  border-bottom: 1px solid rgba(255, 242, 241, 0.2);
`;
export const UsersContainer = styled.div`
  display: flex;
  gap: 10px;
  height: 100%;
`;
