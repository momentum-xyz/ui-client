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
  const {unityStore} = useStore().mainStore;

  useEffect(() => {
    if (!UnityMuted) {
      UnityService.setSoundEffectVolume('0.1');
      unityStore.setVolume(0.1);
      console.info('UnityMuted?? FALSE', UnityMuted);
    } else if (UnityMuted) {
      UnityService.setSoundEffectVolume('0');
      unityStore.setVolume(0);
      console.info('UnityMuted?? TRUE', UnityMuted);
    }
  }, [UnityMuted]);

  const handleMute = () => {
    unityStore.muteUnity(UnityMuted);
  };

  const handleUnmute = () => {
    unityStore.unmuteUnity(UnityMuted);
  };

  const handleChange = (slider: ChangeEvent<HTMLInputElement>) => {
    unityStore.volumeChange(slider, UnityMuted);
  };

  return (
    <styled.Container>
      <styled.Title>{t('musicPlayer.unityVolume')}</styled.Title>
      <styled.VolumeContainer>
        <SvgButton iconName="player-mute" size="medium" onClick={handleMute} />
        <styled.VolumeBarContainer>
          <styled.BarThumbPosition width={unityStore.volume * 100 + '%'} />
          <styled.VolumeBar
            type="range"
            min="0"
            max="1"
            step=".01"
            value={unityStore.volume}
            onChange={handleChange}
          />
        </styled.VolumeBarContainer>
        <SvgButton iconName="player-unmute" size="medium" onClick={handleUnmute} />
      </styled.VolumeContainer>
    </styled.Container>
  );
};

export default observer(UnityVolumeController);
