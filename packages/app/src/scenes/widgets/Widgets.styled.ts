import styled from 'styled-components';

export const RightToolbars = styled.div`
  display: flex;
  gap: 20px;
`;

export const LeftToolbars = styled.div``;

export const Footer = styled.footer`
  width: 100%;
  padding: 0 10px 10px 10px;
  display: flex;
  justify-content: space-between;
  position: fixed;
  bottom: 0;
  background: linear-gradient(0deg, #202a44 0%, rgba(32, 42, 68, 0) 100%);
  z-index: var(--overlay-z-index);
`;

export const OnlineUsers = styled.div`
  display: flex;
`;
