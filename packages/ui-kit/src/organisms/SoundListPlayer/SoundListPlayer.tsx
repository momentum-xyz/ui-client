import {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {SoundPlayer, SoundVolume} from '../../molecules';

import * as styled from './SoundListPlayer.styled';

export interface SoundListPlayerPropsInterface {
  volumePercent: number;
  onChangeVolume: (volumePercent: number) => void;
}

const SoundListPlayer: FC<SoundListPlayerPropsInterface> = ({volumePercent, onChangeVolume}) => {
  return (
    <styled.Container data-testid="SoundListPlayer-test">
      <styled.TracksWrapper>
        <styled.TrackBlock>
          <styled.Title>No sound selected</styled.Title>
          <SoundPlayer />
        </styled.TrackBlock>

        <styled.TrackBlock>
          <styled.Title>Volume</styled.Title>
          <SoundVolume volumePercent={volumePercent} onChangeVolume={onChangeVolume} />
        </styled.TrackBlock>
      </styled.TracksWrapper>
    </styled.Container>
  );
};

export default observer(SoundListPlayer);
