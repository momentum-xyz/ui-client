import {FC} from 'react';

import {PosBusEmojiMessageType} from 'context/Unity/types';

import * as styled from './EmojiWithAvatarAnimation.styled';

interface PropsInterface {
  emojiMsg: PosBusEmojiMessageType;
  offset: number;
}

const createLettersAvatar = (name: string): string => {
  const words = name.split(' ').filter((w) => !!w);
  const first = words[0]?.[0] || '';
  const second = words[1]?.[0] || words[0][1] || '';
  return String(first + second).toUpperCase();
};

export const EmojiWithAvatarAnimation: FC<PropsInterface> = ({offset, emojiMsg}) => {
  const style = {left: `${offset}%`};
  const {url, urlAvatar, nickname} = emojiMsg;
  return (
    <styled.EmojiContainer style={style}>
      {!!urlAvatar && (
        <styled.Avatar>
          <styled.AvatarImg src={urlAvatar} alt={nickname} />
        </styled.Avatar>
      )}
      {!urlAvatar && !!nickname && (
        <styled.Avatar>
          <styled.AvatarText>{createLettersAvatar(nickname)}</styled.AvatarText>
        </styled.Avatar>
      )}
      <styled.EmojiImg src={url} alt="emoji" />
    </styled.EmojiContainer>
  );
};
