import { FC } from "react";
import { ReactionSelector, ReactionSelectorProps } from "stream-chat-react"
import { ReactionEmoji, defaultMinimalEmojis } from "stream-chat-react/dist/components/Channel/emojiData";
import { DefaultStreamChatGenerics } from "stream-chat-react/dist/types/types";

const emojiIds = ['like', 'love', 'haha', 'wow', 'sad'];
const customReactions: ReactionEmoji[] = defaultMinimalEmojis.filter(
    (emoji) => emojiIds.includes(emoji.id)
);


export const CustomReactionSelector: FC<ReactionSelectorProps<DefaultStreamChatGenerics>> = (props) => {
    return (
        <>
          <ReactionSelector reactionOptions={customReactions} {...props} />
        </>
    )
}
