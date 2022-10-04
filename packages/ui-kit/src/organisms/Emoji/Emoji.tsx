import {FC} from 'react';

import {PropsWithThemeInterface} from '../../interfaces';

import * as styled from './Emoji.styled';

interface PropsInterface extends PropsWithThemeInterface {
  name: string;
  emoji: string;
  onClick: () => void;
}

const Emoji: FC<PropsInterface> = ({emoji, name, onClick}) => {
  return (
    <styled.Emoji onClick={onClick}>
      <styled.EmojiImg src={emoji} alt={name} title={name} />
    </styled.Emoji>
  );
};

export default Emoji;
