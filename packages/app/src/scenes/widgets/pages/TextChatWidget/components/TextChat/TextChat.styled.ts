import styled from 'styled-components';

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
  border-radius: 6px;
  overflow: hidden;
  height: 100%;

  margin-left: 10px;
  width: 100%;
  margin: 0;

  .str-chat {
    --str-chat__font-family: IBM Plex Sans, sans-serif;
    font-size: var(--font-size-s);

    --str-chat__primary-color: ${(props) => props.theme.accent};
    --str-chat__background-color: transparent;
    --str-chat__virtual-list-background-color: transparent;
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

  .str-chat__virtual-list .str-chat__message-list-scroll > div {
    padding-top: 10px;
  }
  .str-chat__message-simple__actions {
    display: none !important;
  }
  .str-chat__message--other .str-chat__message-inner {
    margin-inline-end: 0; // since we don't show message options button
  }
  .str-chat__message--me .str-chat__message-inner {
    margin-inline-start: 0;
  }

  .str-chat__list-notifications {
    display: none;
  }

  .str-chat__message-input {
    border-block: solid var(--str-chat__background-color);
    border-inline: solid var(--str-chat__background-color);
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    &:focus,
    &:hover {
      border-block: solid var(--str-chat__primary-color);
      border-inline: solid var(--str-chat__primary-color);
    }
    :not(&:hover) {
      border-top: 2px solid ${(props) => props.theme.accent};
    }
    .str-chat__send-button {
      height: calc(var(--str-chat__spacing-px) * 37);
    }
    .str-chat__message-input-inner {
      .str-chat__message-textarea-container {
        .str-chat__message-textarea-with-emoji-picker {
          padding: var(--str-chat__spacing-2) 0;

          .str-chat__message-textarea {
            font-size: var(--font-size-s);
          }
        }
      }
    }
  }
  .str-chat__avatar .str-chat__avatar-fallback {
    border-block: 1px solid var(--str-chat__primary-color);
    border-inline: 1px solid var(--str-chat__primary-color);
  }
  .str-chat__message-metadata {
    // to make the message groups visually separated
    margin-bottom: 12px;

    .str-chat__message-simple-name {
      color: var(--str-chat__primary-color);
    }
  }
  .str-chat__empty-channel {
    svg {
      height: 55px;
    }
    .str-chat__empty-channel-text {
      font-size: var(--font-size-s);
    }
  }
`;

export const IFrame = styled.iframe`
  height: 100%;
  width: 100%;
`;
