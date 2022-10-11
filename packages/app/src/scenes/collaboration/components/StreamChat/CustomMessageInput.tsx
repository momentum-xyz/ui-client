import {ChatAutoComplete, SendButton, useMessageInputContext} from 'stream-chat-react';

/**
 * Custom message input UI.
 *
 * Dropping upload and emoji features (for now).
 */
export const CustomMessageInput = () => {
  //const { t } = useTranslationContext();

  const {text, handleSubmit} = useMessageInputContext();

  return (
    <div className="str-chat__input-flat str-chat__message-input">
      <div className="str-chat__message-input-inner">
        <div className="str-chat__message-textarea-container">
          <div className="str-chat__message-textarea-with-emoji-picker">
            <ChatAutoComplete />
          </div>
        </div>
        <SendButton disabled={!text.length} sendMessage={handleSubmit} />
      </div>
    </div>
  );
};
