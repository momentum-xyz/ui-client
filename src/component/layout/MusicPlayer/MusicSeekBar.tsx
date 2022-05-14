import React, {ChangeEvent, useCallback, useState} from 'react';

import {useMusicPlayer} from '../../../context/MusicPlayer/hooks/useMusicPlayer';
import {useMusicPosition} from '../../../context/MusicPlayer/hooks/useMusicPosition';

const formatTime = (seconds: number) => {
  const floored = Math.floor(seconds);
  let from = 14;
  let length = 5;
  // Display hours only if necessary.
  if (floored >= 3600) {
    from = 11;
    length = 8;
  }

  return new Date(floored * 1000).toISOString().substr(from, length);
};

export const MusicSeekBar: React.FC = () => {
  const {position, duration, seek} = useMusicPosition({
    highRefreshRate: true
  });
  const elapsed = position;
  const {player, playing} = useMusicPlayer();
  const [onSeek, setOnSeek] = useState<boolean>();

  const handleChange = useCallback(
    (slider: ChangeEvent<HTMLInputElement>) => {
      const posValue = parseFloat(slider.target.value);
      return seek(posValue);
    },
    [seek]
  );

  const handleMouseDown = () => {
    if (!playing) {
      setOnSeek(true);
      return;
    }
    player?.pause();
    setOnSeek(false);
  };

  const handleMouseUp = () => {
    // player?.pause();
    if (!playing && !onSeek) {
      player?.play();
    }
  };

  if (!duration) {
    return (
      <div className="flex justify-between justify-center items-center px-1 mt-2 text-xs font-normal text-white-50 h-1.5">
        <div className="pr-.6">00:00</div>

        <div className="relative bg-prime-blue-20 rounded h-.39 w-full">
          <input
            className="slider absolute top-0 left-0 bg-green-light-10 rounded h-.39 transition"
            type="range"
            min={0}
            max={1}
            defaultValue={0}
            readOnly
          />
        </div>
        <div className="pl-.6">00:00</div>
      </div>
    );
  }

  const calculateDurationBarWidth = () => {
    if ((position / duration) * 100 < 50) {
      return `${(position / duration) * 100 + 0.9}%`;
    }

    return `${(position / duration) * 100 - 0.9}%`;
  };

  return (
    <div className="flex justify-between justify-center items-center px-1 mt-2 text-xs font-normal text-white-50 h-1.5">
      <div className="pr-.6">{`${formatTime(elapsed)}`}</div>
      <div
        className="relative bg-prime-blue-20 rounded h-.39"
        style={{width: duration * 100 + '%'}}
      >
        <div
          className="absolute bg-green-light-100 h-.25 rounded-l left-0 top-0"
          style={{width: calculateDurationBarWidth()}}
        />
        <input
          className="slider absolute top-0 left-0 bg-green-light-10 rounded h-.39 transition"
          type="range"
          min={0}
          max={duration}
          onChange={handleChange}
          value={position}
          onMouseUp={handleMouseUp}
          onMouseDown={handleMouseDown}
        />
      </div>
      <div className="pl-.6">{`${formatTime(duration)}`}</div>
    </div>
  );
};
