import React, {ChangeEvent, useCallback, useEffect, useState} from 'react';

import {useMusicPlayer} from '../../../context/MusicPlayer/hooks/useMusicPlayer';
import {ReactComponent as MuteIcon} from '../../../images/icons/music-mute.svg';
import {ReactComponent as MaxVolumeIcon} from '../../../images/icons/music-max.svg';

interface MusicVolumeControllerProps {
  label: string;
}

export const MusicVolumeController: React.FC<MusicVolumeControllerProps> = ({label}) => {
  const {vol, mute, volume} = useMusicPlayer();
  const [muted, setMuted] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState<number>(vol);
  const [currentVol, setCurrentVol] = useState<number>(vol);

  useEffect(() => {
    volume(volumeLevel);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume]);

  useEffect(() => {
    if (volumeLevel > 0.01) {setMuted(false);}
    else if (volumeLevel === 0.01) {setMuted(true);}
  }, [volumeLevel]);

  useEffect(() => {
    mute(muted);

    if (muted) {
      setCurrentVol(volumeLevel);
      setVolumeLevel(0.01);
    } else {
      setVolumeLevel(currentVol);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [muted]);

  const handleChange = useCallback(
    (slider: ChangeEvent<HTMLInputElement>) => {
      const volValue = parseFloat(slider.target.value);
      setVolumeLevel(volValue);
      setCurrentVol(volValue);
      return volume(volValue);
    },
    [volume]
  );

  const handleMute = () => {
    setMuted(true);
  };

  const handleVolumeStep = () => {
    const newVolume = Math.min((muted ? 0 : volumeLevel) + 0.1, 1.0);
    mute(false);
    setCurrentVol(newVolume);
    setVolumeLevel(newVolume);
    volume(newVolume);
  };

  return (
    <div className="">
      <p className="select-none">{label}</p>
      <div className="justify-between flex container w-full justify-center items-center">
        <div className="pr-.6 opacity-50 hover:opacity-100">
          <MuteIcon onClick={handleMute} />
        </div>
        <div className="relative bg-prime-blue-20 rounded h-.39 w-full">
          <div
            className="absolute bg-green-light-100 h-.25 rounded-l left-0 top-0"
            style={{width: `${volumeLevel * 100}%`}}
          />
          <input
            className="slider-volume absolute h-.39 rounded bg-green-light-10"
            type="range"
            min={0.01}
            max={1}
            step={0.01}
            onChange={handleChange}
            value={volumeLevel}
          />
        </div>
        <div className="pl-.6 opacity-50 hover:opacity-100">
          <MaxVolumeIcon onClick={handleVolumeStep} />
        </div>
      </div>
    </div>
  );
};
