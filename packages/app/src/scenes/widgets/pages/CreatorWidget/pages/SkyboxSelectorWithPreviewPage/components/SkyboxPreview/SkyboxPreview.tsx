import {Frame, Button} from '@momentum-xyz/ui-kit-storybook';
import {useI18n} from '@momentum-xyz/core';

import {Asset3dInterface} from 'core/models';

import * as styled from './SkyboxPreview.styled';

interface PropsInterface {
  skybox: Asset3dInterface;
  onSkyboxSelect: (skybox: Asset3dInterface) => void;
  onSkyboxDelete: (skybox: Asset3dInterface) => void;
  onBack: () => void;
}

export const SkyboxPreview = ({
  skybox,
  onSkyboxSelect,
  onSkyboxDelete,
  onBack
}: PropsInterface): JSX.Element => {
  const {t} = useI18n();

  return (
    <styled.Container>
      <styled.SkyboxInfoContainer>
        <Frame>
          <styled.SkyboxImage src={skybox.image} />
        </Frame>
        <styled.SkyboxTitle>{skybox.name}</styled.SkyboxTitle>
      </styled.SkyboxInfoContainer>

      <styled.ControlsRow>
        <Button label={t('actions.goBack')} variant="secondary" onClick={onBack} />
        <Button
          label={t('actions.delete')}
          variant="secondary"
          onClick={() => onSkyboxDelete(skybox)}
        />
        <Button label="Change Skybox" onClick={() => onSkyboxSelect(skybox)} />
      </styled.ControlsRow>
    </styled.Container>
  );
};
