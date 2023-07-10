import styled from 'styled-components';

export const Container = styled.div`
  padding: 10px 0 0 0;
`;

export const NotAllowed = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;

  div {
    display: flex;
    width: 260px;
    justify-content: center;
    text-align: center;
  }
`;
