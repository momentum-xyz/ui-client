import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import * as styled from './MiroBoard.styled';

interface PropsInterface {
  miroUrl: string;
}

const MiroBoard: FC<PropsInterface> = ({miroUrl}) => {
  return (
    <styled.Wrapper>
      <iframe
        title="Miro board"
        width="800"
        height="500"
        className="w-full h-full"
        src={miroUrl}
        frameBorder="0"
        scrolling="no"
        allowFullScreen
      />
    </styled.Wrapper>
  );
};

export default observer(MiroBoard);
