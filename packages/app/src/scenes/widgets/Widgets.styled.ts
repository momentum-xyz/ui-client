import styled from 'styled-components';

export const MainLinks = styled.div`
  display: flex;
  gap: 30px;
`;

export const Toolbars = styled.div`
  display: flex;
  gap: 20px;
`;

export const Footer = styled.footer`
  display: flex;
  justify-content: space-between;
  position: fixed;
  bottom: 0;
  z-index: var(--overlay-z-index);
  width: 100%;
  padding: 0 10px 10px 20px;
`;

export const EmojiBar = styled.div`
  position: fixed;
  bottom: 55px;
  left: 10px;
  z-index: calc(var(--overlay-z-index) + 1);
`;

export const ChatIconWrapper = styled.div`
  position: relative;
`;
export const MessageCount = styled.span`
  position: absolute;
  color: ${(props) => props.theme.accent};
  top: -5px;
  right: -7px;

  height: 7px;
  width: 7px;
  border-radius: 50%;
  background-color: rgba(255, 174, 99, 0.9);
  color: transparent;
`;
