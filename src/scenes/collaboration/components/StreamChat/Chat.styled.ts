import styled from 'styled-components';
import {rgba} from 'polished';

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

  .str-chat {
    --str-chat__font-family: IBM Plex Sans, sans-serif;

    --str-chat__background-color: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.8)};
    --str-chat__secondary-background-color: rgba(1,255,179,0.2);
    --str-chat__primary-surface-color: rgba(1,255,179,0.2);
    --str-chat__secondary-surface-color: rgba(1,255,179,0.2);
    --str-chat__tertiary-surface-color: rgba(0,0,0,0);

    --str-chat__border-radius-circle: 5px;

    --str-chat__message-reactions-options-box-shadow: none;
  }

`;

export const IFrame = styled.iframe`
  height: 100%;
  width: 100%;
`
