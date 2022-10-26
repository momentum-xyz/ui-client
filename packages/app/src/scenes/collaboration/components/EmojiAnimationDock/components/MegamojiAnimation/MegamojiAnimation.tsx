import {FC} from 'react';

import * as styled from './MegamojiAnimation.styled';

interface PropsInterface {
  emojiUrl: string;
}

export const MegamojiAnimation: FC<PropsInterface> = ({emojiUrl}) => {
  return (
    <styled.MegamojiContainer>
      <styled.MegamojiImg src={emojiUrl} alt="megamoji" />
    </styled.MegamojiContainer>
  );
};
