import styled from 'styled-components';

export const Container = styled.div`
  padding: 5px 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Message = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  width: 80px;
  border-radius: 100%;
  background: ${(props) => props.theme.bg};
`;
