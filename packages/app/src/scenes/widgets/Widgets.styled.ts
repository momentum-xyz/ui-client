import styled from 'styled-components';

export const RightToolbars = styled.div`
  display: flex;
  gap: 20px;
  pointer-events: all;
`;

export const LeftToolbars = styled.div`
  pointer-events: all;
`;

export const Links = styled.div`
  pointer-events: all;
  width: 100%;
  margin: 0 10px;
  display: flex;
  justify-content: start;
  align-items: center;
`;

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

export const FullSizeWrapper = styled.div`
  width: 100%;
`;
