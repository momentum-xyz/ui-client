import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {SvgButton} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';

import * as styled from './UnityVolumeController.styled';

const UnityVolumeController: FC = () => {
  const {universeStore} = useStore();
  const {world3dStore} = universeStore;

  const {t} = useI18n();

  return (
    <styled.Container data-testid="UnityVolumeController-test">
      <styled.Title>{t('musicPlayer.unityVolume')}</styled.Title>
      <styled.VolumeContainer>
        <SvgButton
          iconName="player-mute"
          size="medium"
          onClick={world3dStore?.mute}
          disabled={world3dStore?.volume === 0}
        />
        <styled.VolumeBarContainer>
          <styled.BarThumbPosition width={(world3dStore?.volume || 0) * 100 + '%'} />
          <styled.VolumeBar
            type="range"
            min="0"
            max="1"
            step=".01"
            value={world3dStore?.volume}
            onChange={(e) => {
              world3dStore?.volumeChange(parseFloat(e.target.value));
            }}
          />
        </styled.VolumeBarContainer>
        <SvgButton
          iconName="player-unmute"
          size="medium"
          onClick={world3dStore?.unmute}
          disabled={world3dStore?.volume === 1}
        />
      </styled.VolumeContainer>
    </styled.Container>
  );
};

export default observer(UnityVolumeController);
