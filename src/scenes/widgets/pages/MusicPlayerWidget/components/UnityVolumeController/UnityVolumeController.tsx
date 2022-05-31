import React, {ChangeEvent, FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';

import {useStore} from 'shared/hooks';
import {SvgButton} from 'ui-kit';
import {useUnityStore} from 'store/unityStore';
import UnityService from 'context/Unity/UnityService';

import * as styled from './UnityVolumeController.styled';

export interface PropsInterface {}

const UnityVolumeController: FC<PropsInterface> = () => {
  const UnityMuted = useUnityStore((state) => state.muted);
  const {musicPlayerStore} = useStore().widgetStore;
  const {unityVolumeStore} = musicPlayerStore;
  const {volume, setVolume, handleMuteUnity, handleUnmuteUnity, handleChangeVolume} =
    unityVolumeStore;

  useEffect(() => {
    if (!UnityMuted) {
      UnityService.setSoundEffectVolume('0.1');
      console.info('UnityMuted?? FALSE', UnityMuted);
    } else if (UnityMuted) {
      setVolume(0);
      UnityService.setSoundEffectVolume('0');
      console.info('UnityMuted?? TRUE', UnityMuted);
    }
  }, [UnityMuted]);

  const handleMute = () => {
    handleMuteUnity(UnityMuted);
  };

  const handleUnmute = () => {
    handleUnmuteUnity(UnityMuted);
  };

  const handleChange = (slider: ChangeEvent<HTMLInputElement>) => {
    handleChangeVolume(slider, UnityMuted);
  };

  return (
    <styled.Container>
      <styled.Title>{t('musicPlayer.unityVolume')}</styled.Title>
      <styled.VolumeContainer>
        <SvgButton iconName="player-mute" size="medium" onClick={handleMute} />
        <styled.VolumeBarContainer width={100 + '%'}>
          <styled.BarThumbPosition width={volume * 100 + '%'} />
          <styled.VolumeBar
            type="range"
            min="0"
            max="1"
            step=".01"
            value={volume}
            onChange={handleChange}
          />
        </styled.VolumeBarContainer>
        <SvgButton iconName="player-unmute" size="medium" onClick={handleUnmute} />
      </styled.VolumeContainer>
    </styled.Container>
  );
};

export default observer(UnityVolumeController);
