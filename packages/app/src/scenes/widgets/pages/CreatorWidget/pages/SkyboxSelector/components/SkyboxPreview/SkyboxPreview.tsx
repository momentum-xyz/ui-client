import {Frame, Button, Image} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {Asset3dInterface} from 'core/models';

import * as styled from './SkyboxPreview.styled';

interface PropsInterface {
  skybox: Asset3dInterface;
  onSkyboxSelect: (skybox: Asset3dInterface) => void;
  // eslint-disable-next-line react/no-unused-prop-types
  onSkyboxDelete?: (skybox: Asset3dInterface) => void;
  onBack: () => void;
}

export const SkyboxPreview = ({skybox, onSkyboxSelect, onBack}: PropsInterface): JSX.Element => {
  const {t} = useI18n();

  return (
    <styled.Container>
      <styled.SkyboxInfoContainer>
        <Frame>
          <Image src={skybox.image} height={360} bordered />
        </Frame>
        <styled.SkyboxTitle>{skybox.name}</styled.SkyboxTitle>
        {skybox.artist_name && (
          <styled.Row>
            <styled.Prop>
              <styled.PropName>Created by:</styled.PropName>
              <styled.PropValue>{skybox.artist_name}</styled.PropValue>
            </styled.Prop>
          </styled.Row>
        )}
      </styled.SkyboxInfoContainer>

      <styled.ControlsRow>
        <Button label={t('actions.goBack')} variant="secondary" onClick={onBack} />
        {/* No delete logic? */}
        {/* <Button
          label={t('actions.delete')}
          variant="secondary"
          onClick={() => onSkyboxDelete(skybox)}
        /> */}
        <Button label="Change Skybox" onClick={() => onSkyboxSelect(skybox)} />
      </styled.ControlsRow>
    </styled.Container>
  );
};
