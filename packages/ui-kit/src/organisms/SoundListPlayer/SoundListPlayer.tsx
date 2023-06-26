import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {MediaFileInterface, useI18n} from '@momentum-xyz/core';

import {SoundPlayer, SoundVolume} from '../../molecules';

import * as styled from './SoundListPlayer.styled';

export interface SoundListPlayerPropsInterface {
  tracks: MediaFileInterface[];
  volumePercent: number;
  onChangeVolume: (volumePercent: number) => void;
  onDeleteTrack?: (hash: string) => void;
}

const SoundListPlayer: FC<SoundListPlayerPropsInterface> = ({
  tracks,
  volumePercent,
  onChangeVolume,
  onDeleteTrack
}) => {
  const {t} = useI18n();

  return (
    <styled.Container data-testid="SoundListPlayer-test">
      <styled.ActiveTrack>
        <styled.Block>
          <styled.Title>{t('messages.noSoundSelected')}</styled.Title>
          <SoundPlayer />
        </styled.Block>

        <styled.Block>
          <styled.Title>{t('labels.volume')}</styled.Title>
          <SoundVolume volumePercent={volumePercent} onChangeVolume={onChangeVolume} />
        </styled.Block>
      </styled.ActiveTrack>

      <styled.TrackList></styled.TrackList>
    </styled.Container>
  );
};

export default observer(SoundListPlayer);
