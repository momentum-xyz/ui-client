import styled from 'styled-components';

export const Container = styled.div``;

export const ActionBar = styled.div`
  padding: 20px 0;
  display: flex;
  justify-content: space-between;
  gap: 40px;

  & > button {
    flex: 1;
    justify-content: center;
    max-width: 156px;
  }
`;
