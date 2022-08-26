import {FC} from 'react';

import {PosBusEmojiMessageType} from 'core/types';

import * as styled from './EmojiWithAvatarAnimation.styled';

interface PropsInterface {
  emojiMsg: PosBusEmojiMessageType;
  offset: number;
}

export const EmojiWithAvatarAnimation: FC<PropsInterface> = ({offset, emojiMsg}) => {
  const style = {left: `${offset}%`};
  const {url, urlAvatar, userName} = emojiMsg;
  return (
    <styled.EmojiContainer style={style}>
      {!!urlAvatar && <styled.Avatar src={urlAvatar} alt={userName} />}
      <styled.EmojiImg src={url} alt="emoji" />
    </styled.EmojiContainer>
  );
};
