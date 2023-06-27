import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {MediaFileInterface, useI18n} from '@momentum-xyz/core';

import {SoundItem, SoundPlayer, SoundVolume} from '../../molecules';

import * as styled from './MusicPlayerView.styled';

export interface MusicPlayerViewPropsInterface {
  tracks: MediaFileInterface[];
  activeTrack?: MediaFileInterface | null;
  isPlaying: boolean;
  durationSec?: number;
  playedSec?: number;
  volumePercent: number;
  onStart?: (track: MediaFileInterface) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onChangeVolume: (volumePercent: number) => void;
  onChangePlayed?: (playedSec: number) => void;
  onDeleteTrack?: (hash: string) => void;
}

const MusicPlayerView: FC<MusicPlayerViewPropsInterface> = ({
  tracks,
  activeTrack,
  isPlaying,
  durationSec,
  playedSec,
  volumePercent,
  onStart,
  onPlay,
  onPause,
  onStop,
  onChangeVolume,
  onChangePlayed,
  onDeleteTrack
}) => {
  const {t} = useI18n();

  return (
    <styled.Container data-testid="MusicPlayerView-test">
      <styled.ActiveTrack>
        <styled.Block>
          <styled.Title>
            {!activeTrack ? t('messages.noSoundSelected') : activeTrack.name}
          </styled.Title>
          <SoundPlayer
            isPlaying={isPlaying}
            isStopped={!activeTrack}
            durationSec={durationSec}
            playedSec={playedSec}
            onIsPlaying={isPlaying ? onPause : onPlay}
            onChangePlayed={onChangePlayed}
          />
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
            isActive={activeTrack?.hash === track.hash}
            onStart={() => onStart?.(track)}
            onStop={() => onStop?.()}
            onDelete={onDeleteTrack ? () => onDeleteTrack(track.hash) : undefined}
          />
        ))}
      </styled.TrackList>
    </styled.Container>
  );
};

export default observer(MusicPlayerView);
