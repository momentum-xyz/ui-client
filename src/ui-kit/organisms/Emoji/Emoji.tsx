import {FC} from 'react';

import {EmojiDetailsInterface} from 'core/models';

import * as styled from './Emoji.styled';

interface PropsInterface {
  emoji: EmojiDetailsInterface;
  onClick: () => void;
}

const Emoji: FC<PropsInterface> = ({emoji, onClick}) => {
  const {imgSrc, name} = emoji;
  return (
    <styled.Emoji onClick={onClick}>
      <styled.EmojiImg src={imgSrc} alt={name} title={name} />
    </styled.Emoji>
  );
};

export default Emoji;
