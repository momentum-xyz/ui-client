import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';
import {SvgButton} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';

import * as styled from './UnityVolumeController.styled';

const UnityVolumeController: FC = () => {
  const {unityStore} = useStore().mainStore;

  return (
    <styled.Container data-testid="UnityVolumeController-test">
      <styled.Title>{t('musicPlayer.unityVolume')}</styled.Title>
      <styled.VolumeContainer>
        <SvgButton
          iconName="player-mute"
          size="medium"
          onClick={unityStore.mute}
          disabled={unityStore.volume === 0}
        />
        <styled.VolumeBarContainer>
          <styled.BarThumbPosition width={unityStore.volume * 100 + '%'} />
          <styled.VolumeBar
            type="range"
            min="0"
            max="1"
            step=".01"
            value={unityStore.volume}
            onChange={(e) => {
              unityStore.volumeChange(parseFloat(e.target.value));
            }}
          />
        </styled.VolumeBarContainer>
        <SvgButton
          iconName="player-unmute"
          size="medium"
          onClick={unityStore.unmute}
          disabled={unityStore.volume === 1}
        />
      </styled.VolumeContainer>
    </styled.Container>
  );
};

export default observer(UnityVolumeController);
