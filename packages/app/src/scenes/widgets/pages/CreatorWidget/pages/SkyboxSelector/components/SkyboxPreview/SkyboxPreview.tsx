import {Button, Image, ImageSizeEnum} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {getImageAbsoluteUrl} from 'core/utils';
import {SkyboxItemModelType} from 'core/models';
import {BLOCKADE_LABS_ARTIST_NAME} from 'core/constants';
import {BlockadeLabs} from 'ui-kit';

import * as styled from './SkyboxPreview.styled';

interface PropsInterface {
  skybox: SkyboxItemModelType;
  onSkyboxSelect: (skybox: SkyboxItemModelType) => void;
  onBack: () => void;
}

export const SkyboxPreview = ({skybox, onSkyboxSelect, onBack}: PropsInterface): JSX.Element => {
  const {t} = useI18n();

  const isBlockadeLabs = skybox.artist_name === BLOCKADE_LABS_ARTIST_NAME;

  return (
    <styled.Container data-testid="SkyboxPreview-test">
      <styled.SkyboxInfoContainer>
        <styled.PreviewHolder>
          <Image src={getImageAbsoluteUrl(skybox.id, ImageSizeEnum.S4)} height={360} bordered />
          {isBlockadeLabs && <BlockadeLabs small bottomRightAbsolute />}
        </styled.PreviewHolder>
        <styled.SkyboxTitle>{skybox.name}</styled.SkyboxTitle>
        {skybox.artist_name && (
          <styled.Row>
            <styled.Prop>
              <styled.PropName>Created by:</styled.PropName>
              <styled.PropValue>
                {!isBlockadeLabs ? (
                  skybox.artist_name
                ) : (
                  <a href="https://blockadelabs.com/" target="_blank" rel="noreferrer">
                    Blockade Labs
                  </a>
                )}
              </styled.PropValue>
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
      {isBlockadeLabs && <BlockadeLabs withLicense bottomRightFlex />}
    </styled.Container>
  );
};
