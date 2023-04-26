import {Frame, Button} from '@momentum-xyz/ui-kit-storybook';

import {Asset3dInterface} from 'core/models';

import * as styled from './SkyboxPreview.styled';

export interface PropsInterface {
  skybox: Asset3dInterface;
  onSkyboxSelect: (skybox: Asset3dInterface) => void;
  onBack: () => void;
}

export const SkyboxPreview = ({skybox, onSkyboxSelect, onBack}: PropsInterface): JSX.Element => {
  return (
    <styled.Container>
      <Frame>
        <styled.SkyboxImage src={skybox.image} />
      </Frame>
      <styled.SkyboxTitle>{skybox.name}</styled.SkyboxTitle>

      <styled.ControlsRow>
        <Button label="Go Back" variant="secondary" onClick={onBack} />
        <Button label="Change Skybox" onClick={() => onSkyboxSelect(skybox)} />
      </styled.ControlsRow>
    </styled.Container>
  );
};
