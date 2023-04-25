import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
  display: flex;
  width: 100%;
  justify-content: space-between;
  color: ${(props) => props.theme.text};
`;

export const OnlineUsers = styled.div`
  pointer-events: all;
`;

export const World = styled.div`
  pointer-events: all;
`;
