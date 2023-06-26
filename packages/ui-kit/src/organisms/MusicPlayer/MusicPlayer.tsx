import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {MediaFileInterface, useI18n} from '@momentum-xyz/core';

import {SoundItem, SoundPlayer, SoundVolume} from '../../molecules';

import * as styled from './MusicPlayer.styled';

export interface MusicPlayerPropsInterface {
  tracks: MediaFileInterface[];
  volumePercent: number;
  onChangeVolume: (volumePercent: number) => void;
  onDeleteTrack?: (hash: string) => void;
}

const MusicPlayer: FC<MusicPlayerPropsInterface> = ({
  tracks,
  volumePercent,
  onChangeVolume,
  onDeleteTrack
}) => {
  const {t} = useI18n();

  return (
    <styled.Container data-testid="MusicPlayer-test">
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

      <styled.TrackList>
        {tracks.map((track) => (
          <SoundItem
            key={track.hash}
            item={track}
            isActive={false}
            onPlayPause={() => {}}
            onDelete={onDeleteTrack ? () => onDeleteTrack(track.hash) : undefined}
          />
        ))}
      </styled.TrackList>
    </styled.Container>
  );
};

export default observer(MusicPlayer);
