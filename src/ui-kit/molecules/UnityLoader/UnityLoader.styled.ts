import styled from 'styled-components';
import {rgba} from 'polished';

export const Inner = styled.div`
  --spinner-size: 60px;
  --message-padding: 15px;
  --message-margin: 80px;
  --message-height: 42px;
  --message-radius: 20px;

  position: fixed;
  background-color: ${(props) => props.theme.bg};
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
`;

export const Wrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Image = styled.img`
  margin: 0 0 20px 0;
  width: var(--spinner-size);
  height: var(--spinner-size);
  animation: spin 1s linear infinite;
`;

export const Version = styled.div`
  opacity: 0.5;
`;

export const MessageWrapper = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xs);
  bottom: 0;
  left: 0;
  right: 0;
`;

export const Message = styled.div`
  display: flex;
  padding: 0 var(--message-padding);
  margin: 0 0 var(--message-margin) 0;
  height: var(--message-height);
  justify-content: center;
  align-items: center;
  border: 2px solid ${(props) => props.theme.accent};
  background: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.2)};
  color: ${(props) => props.theme.text};
  font-size: var(--font-size-xs);
  border-radius: var(--message-radius);
`;

export const Link = styled.a`
  padding: 0 0 0 5px;
  color: ${(props) => props.theme.accent};
  font-size: var(--font-size-xs);
  text-transform: lowercase;
`;
