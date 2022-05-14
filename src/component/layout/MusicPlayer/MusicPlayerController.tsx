import React, {useEffect, useState} from 'react';

import {useMusicPlayer} from '../../../context/MusicPlayer/hooks/useMusicPlayer';
import {ReactComponent as PlayBackIcon} from '../../../images/icons/music-playback.svg';
import {ReactComponent as LeftArrowIcon} from '../../../images/icons/music-left-arrow.svg';
import {ReactComponent as RightArrowIcon} from '../../../images/icons/music-right-arrow.svg';
import {ReactComponent as PauseIcon} from '../../../images/icons/music-pause.svg';

export interface MusicPlayerControllerProps {
  playlistHash: string[];
}

const MusicPlayerController: React.FC<MusicPlayerControllerProps> = ({playlistHash}) => {
  const {load, togglePlayPause, playing, ended, show, vol} = useMusicPlayer();
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [playlist, setPlaylist] = useState<string[]>();
  const [stop, setStop] = useState<boolean>(false);

  useEffect(() => {
    if (!playlistHash) return;
    setPlaylist(playlistHash);
  }, [playlistHash, show]);

  useEffect(() => {
    if (!playlist) return;
    if (show) {
      console.info('Playlist:', playlist);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  useEffect(() => {
    setStop(false);
  }, [togglePlayPause]);
  // ended && !stop ? !playing : playing
  useEffect(() => {
    if (!playlistHash || !playlist) return;

    if (currentTrackIndex > playlist.length) setCurrentTrackIndex(0);
    if (
      (show && playlist && playlist[currentTrackIndex]) ||
      (ended && playlist && playlist[currentTrackIndex])
    ) {
      load({
        src: window._env_.RENDER_SERVICE_URL + `/track/${playlist[currentTrackIndex][0]}`,
        autoplay: ended && !stop ? !playing : playing,
        volume: vol,
        html5: true,
        format: ['mp3', 'ogg', 'wave']
      });
    } else {
      load({
        src: 'none.mp3',
        autoplay: playing
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIndex, playlist]);

  useEffect(() => {
    if (!ended) return;

    if (currentTrackIndex === (playlist?.length ?? 0) - 1) {
      setCurrentTrackIndex(0);
      // setStop(true);
      return;
    }

    setCurrentTrackIndex((currentIndex) => currentIndex + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ended]);

  const handleNextTrack = () => {
    if (currentTrackIndex === (playlist?.length ?? 0) - 1) {
      setCurrentTrackIndex(0);
      return;
    }
    setCurrentTrackIndex((currentIndex) => currentIndex + 1);
  };

  const handlePreviousTrack = () => {
    if (currentTrackIndex !== 0) {
      setCurrentTrackIndex((currentIndex) => currentIndex - 1);
    }
  };

  return (
    <div className="justify-center text-center text-sm text-green-light-100 capitalize font-normal h-5">
      <div className="truncate items-center mb-.1">
        {playlist?.[currentTrackIndex]?.[1] ? playlist[currentTrackIndex][1] : 'Empty Playlist'}
      </div>
      <div className="container flex justify-between justify-center items-center pl-4.5 pr-4.5 mt-1.4 h-2">
        <div className="opacity-50 hover:opacity-100">
          <LeftArrowIcon onClick={handlePreviousTrack} />
        </div>
        <div className="opacity-50 hover:opacity-100 overflow-hidden block">
          {!playing ? (
            <PlayBackIcon onClick={togglePlayPause} className="cursor-pointer" />
          ) : (
            <PauseIcon onClick={togglePlayPause} className="cursor-pointer" />
          )}
        </div>
        <div className="opacity-50 hover:opacity-100">
          <RightArrowIcon onClick={handleNextTrack} />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayerController;
