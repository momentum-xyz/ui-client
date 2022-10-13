import styled from 'styled-components';
import {rgba} from 'polished';
import {Heading} from '@momentum-xyz/ui-kit';

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
  width: 100%;
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
  width: 100%;

  overflow-y: scroll;
  overflow-x: hidden;
  padding: 10px 20px 20px;
`;

export const TextContainer = styled.li`
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${(props) => props.theme.accent && rgba(props.theme.accent, 0.2)};
  color: ${(props) => props.theme.text};
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

export const TextWrapper = styled.div`
  width: calc(10 * (100% / 12));
`;

export const Text = styled.div`
  display: block;
  width: 100%

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
  line-height: 20px;
  font-weight: 400;
  color: ${(props) => props.theme.text && rgba(props.theme.text, 0.4)};
`;

export const Time = styled.time`
  font-weight: 400;
  line-height: 20px;
  font-size: 13px;
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
