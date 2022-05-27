import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {SvgButton} from 'ui-kit';

import * as styled from './PlayerController.styled';

export interface PropsInterface {
  onPlay: () => void;
}

const PlayerController: FC<PropsInterface> = ({onPlay}) => {
  return (
    <styled.Div>
      <SvgButton iconName="play-button" size="small" onClick={onPlay} />
    </styled.Div>
  );
};

export default observer(PlayerController);
