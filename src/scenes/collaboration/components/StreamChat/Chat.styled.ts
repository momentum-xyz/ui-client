import styled from 'styled-components';
import {rgba} from 'polished';

/**
 * Chat panel styling.
 *
 * Tweak str-chat css to match our existing styling.
 * Minimal, we disabled most features for now, so only what is needed.
 *
 * See https://getstream.io/chat/docs/sdk/react/theming/global-variables/
 * and https://github.com/GetStream/stream-chat-css for reference.
 */
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

    --str-chat__primary-color: ${(props) => props.theme.accent};
    --str-chat__background-color: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.8)};
    --str-chat__secondary-background-color: var(--str-chat__background-color);

    --str-chat__primary-surface-color: rgba(1, 255, 179, 0.4);
    --str-chat__secondary-surface-color: rgba(1, 255, 179, 0.1);
    --str-chat__tertiary-surface-color: rgba(0, 0, 0, 0);

    --str-chat__own-message-bubble-background-color: rgba(1, 255, 179, 0.4);
    --str-chat__message-bubble-color: #fff2f1;

    --str-chat__border-radius-circle: 5px;

    --str-chat__avatar-background-color: ${(props) => props.theme.bg};
    --str-chat__avatar-border-radius: 100%;
    --str-chat__avatar-box-shadow: none;
    --str-chat__message-reactions-options-box-shadow: none;

    --str-chat__message-textarea-border-block-start: none;
    --str-chat__message-textarea-border-block-end: none;
    --str-chat__message-textarea-border-inline-start: none;
    --str-chat__message-textarea-border-inline-end: none;
  }

  .str-chat__message-simple__actions {
    display: none;
  }
  .str-chat__message-input {
    border-block: solid var(--str-chat__background-color);
    border-inline: solid var(--str-chat__background-color);
    border-bottom-right-radius: 6px;
    border-bottom-left-radius: 6px;
    &:focus,
    &:hover {
      border-block: solid var(--str-chat__primary-color);
      border-inline: solid var(--str-chat__primary-color);
    }
    .str-chat__send-button {
      height: calc(var(--str-chat__spacing-px) * 37);
    }
    .str-chat__message-input-inner {
      .str-chat__message-textarea-container {
        .str-chat__message-textarea-with-emoji-picker {
          padding: var(--str-chat__spacing-2) 0;

          .str-chat__message-textarea {
            font-size: 13px;
          }
        }
      }
    }
  }
  .str-chat__avatar .str-chat__avatar-fallback {
    border-block: 1px solid var(--str-chat__primary-color);
    border-inline: 1px solid var(--str-chat__primary-color);
  }
  .str-chat__message-simple-name {
    color: var(--str-chat__primary-color);
  }
  .str-chat__empty-channel {
    svg {
      height: 55px;
    }
    .str-chat__empty-channel-text {
      font-size: 13px;
    }
  }
`;

export const IFrame = styled.iframe`
  height: 100%;
  width: 100%;
`;
