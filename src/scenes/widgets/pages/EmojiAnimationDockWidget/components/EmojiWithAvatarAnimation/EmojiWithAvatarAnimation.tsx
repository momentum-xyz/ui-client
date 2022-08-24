import {FC} from 'react';

import * as styled from './EmojiWithAvatarAnimation.styled';

interface PropsInterface {
  type: 'emoji' | 'megamoji';
  emojiUrl: string;
  userId?: string;
  emojiId?: string;
  offset: number;
}

export const EmojiWithAvatarAnimation: FC<PropsInterface> = ({
  type,
  emojiUrl,
  offset,
  userId,
  emojiId
}) => {
  const style = {left: `${offset}%`};
  // const style = {};
  return type === 'emoji' ? (
    <styled.EmojiContainer style={style}>
      <styled.EmojiImg src={emojiUrl} alt="emoji" />
    </styled.EmojiContainer>
  ) : (
    <styled.MegamojiContainer style={style}>
      <styled.MegamojiImg src={emojiUrl} alt="megamoji" />
    </styled.MegamojiContainer>
  );
};
