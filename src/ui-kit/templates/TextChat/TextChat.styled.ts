import styled from 'styled-components';
import {rgba} from 'polished';

import {Heading} from 'ui-kit';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.8)};
  border-radius: 6px;
  overflow: hidden;
  backdrop-filter: blur(8px);
  height: 100%;

  margin-left: 10px;
  width: 30%;
`;

export const InnerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  text-transform: uppercase;
`;

export const ChatBox = styled.ul`
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  overflow-y: scroll;
  overflow-x: hidden;
  padding: 10px 20px 20px;

  ::-webkit-scrollbar {
    width: 5px;
    height: 0;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 6px;
    border: 5px solid ${(props) => props.theme.accent && rgba(props.theme.accent, 0.6)};
  }

  ::-webkit-scrollbar-track {
    display: none;
  }

  ::-webkit-scrollbar-track-piece:start {
    margin-top: 5px;
  }
`;

export const TextContainer = styled.li`
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${(props) => props.theme.accent && rgba(props.theme.accent, 0.2)};
`;

export const StyledHeading = styled(Heading)`
  h3 {
    display: block;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  padding-right: 5px;
`;

export const Text = styled.div`
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: ${(props) => props.theme.text && rgba(props.theme.text, 0.4)};
`;

export const Time = styled.time`
  font-weight: 400;
  font-size: 13px;
  padding-left: 7px;

  color: ${(props) => props.theme.text && rgba(props.theme.text, 0.5)};
`;

export const Author = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Message = styled.div`
  padding-top: 5px;
  font-size: 14px;
  overflow-wrap: break-word;
`;

export const TextBox = styled.div`
  position: relative;
  width: 100%;
`;
