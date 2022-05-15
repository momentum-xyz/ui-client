import React, {ChangeEvent, useEffect, useState} from 'react';

import {ReactComponent as MuteIcon} from '../../../images/icons/music-mute.svg';
import {ReactComponent as MaxVolumeIcon} from '../../../images/icons/music-max.svg';
import UnityService from '../../../context/Unity/UnityService';
import {useUnityStore} from '../../../store/unityStore';

interface UnityVolumeControllerProps {
  label: string;
}

export const UnityVolumeController: React.FC<UnityVolumeControllerProps> = ({label}) => {
  const UnityMuted = useUnityStore((state) => state.muted);
  const [volumeLevel, setVolumeLevel] = useState<number>(0.1);

  useEffect(() => {
    if (!UnityMuted) {
      UnityService.setSoundEffectVolume('0.1');
      console.info('UnityMuted?? FALSE', UnityMuted);
    } else if (UnityMuted) {
      setVolumeLevel(0.01);
      UnityService.setSoundEffectVolume('0.01');
      console.info('UnityMuted?? TRUE', UnityMuted);
    }
  }, [UnityMuted]);

  const handleMute = () => {
    if (!UnityMuted) {
      UnityService.toggleAllSound();
      UnityService.setSoundEffectVolume('0.01');
      setVolumeLevel(0.01);
    }
  };

  const handleUnmute = () => {
    if (volumeLevel === 1) {return;}
    const newVolume = Math.min((UnityMuted ? 0 : volumeLevel) + 0.1, 1.0);
    setVolumeLevel(newVolume);
    UnityService.setSoundEffectVolume(newVolume.toString());
    if (UnityMuted) {
      UnityService.toggleAllSound();
    }
  };

  const handleChange = (slider: ChangeEvent<HTMLInputElement>) => {
    const volValue = parseFloat(slider.target.value);
    if (!UnityMuted && volValue === 0.01) {UnityService.toggleAllSound();}
    if (UnityMuted && volValue > 0.01) {UnityService.toggleAllSound();}
    setVolumeLevel(volValue);
    UnityService.setSoundEffectVolume(volValue.toString());
  };

  return (
    <div className="mt-.9">
      <p className="select-none">{label}</p>
      <div className="justify-between flex container justify-center w-full items-center">
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
          <MaxVolumeIcon onClick={handleUnmute} />
        </div>
      </div>
    </div>
  );
};
