import styled from 'styled-components';
import {rgba} from 'polished';

import {Heading} from 'ui-kit';

export const Container = styled.div`
  //w-1/3 ml-1

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
`;

export const TextContainer = styled.li`
  // border-b-1 py-1 border-prime-blue-20
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${(props) => props.theme.accent && rgba(props.theme.accent, 0.2)};

  //font-bold text-base uppercase gap-1 flex justify-between
`;

export const StyledHeading = styled(Heading)`
  h2 {
    display: block;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  padding-right: 5px;
`;

export const Text = styled.div`
  font-size: 13px;
  line-height: 20px;
  color: ${(props) => props.theme.text && rgba(props.theme.text, 0.4)};
`;

export const Time = styled.time`
  font-weight: 400;
  font-size: 14px;
  padding-left: 5px;

  color: ${(props) => props.theme.text && rgba(props.theme.text, 0.5)};
`;

export const Author = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Message = styled.div`
  padding-top: 5px;
  overflow-wrap: break-word;
`;

export const TextBox = styled.div`
  position: relative;
  width: 100%;
`;
