import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px 10px;
  display: flex;
  width: 100%;
  justify-content: space-between;
  color: ${(props) => props.theme.text};
`;

export const OnlineUsers = styled.div`
  text-align: left;
`;

export const World = styled.div`
  text-align: right;
`;
