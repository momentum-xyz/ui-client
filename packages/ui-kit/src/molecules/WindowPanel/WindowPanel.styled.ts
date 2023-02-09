import {rgba} from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  // flex: 1 0 auto; ??
  overflow: hidden;
  pointer-events: auto;
  width: 680px;
  height: 420px;
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.9)};
  border-radius: 10px 10px 0px 0px;

  &.expanded {
    margin-top: 20px;
    width: 100%;
    height: calc(100% - 20px);
  }

  transition: all 0.2s ease-in-out;
`;

export const Content = styled.div`
  flex: 1 0 auto;
  width: 100%;
`;
