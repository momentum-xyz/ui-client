import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Model3dPreview} from '@momentum-xyz/map3d';
import {useI18n} from '@momentum-xyz/core';
import {Frame, Input} from '@momentum-xyz/ui-kit-storybook';

import {Asset3d} from 'core/models';
import {useStore} from 'shared/hooks';

import * as styled from './ObjectInspectorPage.styled';
import {ObjectColorPicker} from './components';

const ObjectInspector: FC = () => {
  const {creatorStore} = useStore();
  const {objectName, objectInfo, spawnAssetStore} = creatorStore;
  const {assets3dBasic, assets3dCustom} = spawnAssetStore;

  const {t} = useI18n();

  const canChangeColor = assets3dBasic.some((asset) => asset.id === objectInfo?.asset_3d_id);

  const actualObject =
    assets3dBasic.find((asset) => asset.id === objectInfo?.asset_3d_id) ||
    assets3dCustom.find((asset) => asset.id === objectInfo?.asset_3d_id);

  const actualObjectAsset = actualObject ? Asset3d.create({...actualObject}) : undefined;

  return (
    <styled.Container>
      <styled.Section>
        <Frame>
          <styled.Title>{objectName}</styled.Title>
          <styled.ObjectPreviewModelContainer>
            {actualObjectAsset && (
              <Model3dPreview
                previewUrl={actualObjectAsset.previewUrl}
                delayLoadingMsec={500}
                filename={actualObjectAsset.thumbnailAssetDownloadUrl}
              />
            )}
          </styled.ObjectPreviewModelContainer>
        </Frame>
      </styled.Section>
      <styled.Separator />
      <styled.Section className="large-gap">
        <styled.ControlsRow>
          <styled.ControlsRowTitle>{t('titles.scale')}</styled.ControlsRowTitle>
          <styled.ControlsRowInputsContainer>
            <styled.ControlsRowInputContainer>
              <styled.ControlsRowInputTitle>W</styled.ControlsRowInputTitle>
              <Input onChange={() => {}} />
            </styled.ControlsRowInputContainer>
            <styled.ControlsRowInputContainer>
              <styled.ControlsRowInputTitle>H</styled.ControlsRowInputTitle>
              <Input onChange={() => {}} />
            </styled.ControlsRowInputContainer>
            <styled.ControlsRowInputContainer>
              <styled.ControlsRowInputTitle>D</styled.ControlsRowInputTitle>
              <Input onChange={() => {}} />
            </styled.ControlsRowInputContainer>
          </styled.ControlsRowInputsContainer>
        </styled.ControlsRow>
        <styled.ControlsRow>
          <styled.ControlsRowTitle>{t('titles.position')}</styled.ControlsRowTitle>
          <styled.ControlsRowInputsContainer>
            <styled.ControlsRowInputContainer>
              <styled.ControlsRowInputTitle>X</styled.ControlsRowInputTitle>
              <Input onChange={() => {}} />
            </styled.ControlsRowInputContainer>
            <styled.ControlsRowInputContainer>
              <styled.ControlsRowInputTitle>Y</styled.ControlsRowInputTitle>
              <Input onChange={() => {}} />
            </styled.ControlsRowInputContainer>
            <styled.ControlsRowInputContainer>
              <styled.ControlsRowInputTitle>Z</styled.ControlsRowInputTitle>
              <Input onChange={() => {}} />
            </styled.ControlsRowInputContainer>
          </styled.ControlsRowInputsContainer>
        </styled.ControlsRow>
        <styled.ControlsRow>
          <styled.ControlsRowTitle>{t('titles.rotation')}</styled.ControlsRowTitle>
          <styled.ControlsRowInputsContainer>
            <styled.ControlsRowInputContainer>
              <styled.ControlsRowInputTitle>X</styled.ControlsRowInputTitle>
              <Input onChange={() => {}} />
            </styled.ControlsRowInputContainer>
            <styled.ControlsRowInputContainer>
              <styled.ControlsRowInputTitle>Y</styled.ControlsRowInputTitle>
              <Input onChange={() => {}} />
            </styled.ControlsRowInputContainer>
            <styled.ControlsRowInputContainer>
              <styled.ControlsRowInputTitle>Z</styled.ControlsRowInputTitle>
              <Input onChange={() => {}} />
            </styled.ControlsRowInputContainer>
          </styled.ControlsRowInputsContainer>
        </styled.ControlsRow>
        {/* <Input
          placeholder={t('labels.search')}
          isSearch
          isClearable
          wide
          onChange={spawnAssetStore.searchQuery.setQuery}
          value={spawnAssetStore.searchQuery.query}
        /> */}
      </styled.Section>
      {canChangeColor && (
        <styled.Section className="margin-top">
          <styled.Title>{t('titles.colourPicker')}</styled.Title>
          <ObjectColorPicker />
        </styled.Section>
      )}
    </styled.Container>
  );
};

export default observer(ObjectInspector);
