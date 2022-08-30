import {FC} from 'react';

import * as styled from './MegamojiAnimation.styled';

interface PropsInterface {
  emojiUrl: string;
  offset: number;
}

export const MegamojiAnimation: FC<PropsInterface> = ({emojiUrl, offset}) => {
  const style = {left: `${offset}%`};
  return (
    <styled.MegamojiContainer style={style}>
      <styled.MegamojiImg src={emojiUrl} alt="megamoji" />
    </styled.MegamojiContainer>
  );
};
