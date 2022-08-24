import {FC} from 'react';

import * as styled from './EmojiWithAvatarAnimation.styled';

interface PropsInterface {
  emojiUrl: string;
}

export const EmojiWithAvatarAnimation: FC<PropsInterface> = ({emojiUrl}) => {
  return <styled.EmojiImg src={emojiUrl} alt="emoji" />;
};
