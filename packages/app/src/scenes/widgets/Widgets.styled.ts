import styled from 'styled-components';

export const RightToolbars = styled.div`
  display: flex;
  gap: 20px;
`;

export const LeftToolbars = styled.div``;

export const Footer = styled.footer`
  display: flex;
  justify-content: space-between;
  position: fixed;
  bottom: 0;
  z-index: var(--overlay-z-index);
  width: 100%;
  padding: 0 10px 10px 20px;
`;

export const OnlineUsers = styled.div`
  display: flex;
`;
