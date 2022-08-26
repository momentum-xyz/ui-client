import {FC} from 'react';

import {EmojiDetailsInterface} from 'core/models';

import * as styled from './EmojiItem.styled';

interface PropsInterface {
  emoji: EmojiDetailsInterface;
  onClick: () => void;
}

export const EmojiItem: FC<PropsInterface> = ({emoji, onClick}) => {
  const {imgSrc, name} = emoji;
  return (
    <styled.Emoji onClick={onClick}>
      <styled.EmojiImg src={imgSrc} alt={name} title={name} />
    </styled.Emoji>
  );
};
