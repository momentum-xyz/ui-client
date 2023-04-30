import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Model3dPreview} from '@momentum-xyz/map3d';
import {Frame} from '@momentum-xyz/ui-kit-storybook';

import {Asset3d} from 'core/models';
import {useStore} from 'shared/hooks';

import * as styled from './ObjectInspectorPage.styled';
import {ObjectColorPicker} from './components';

const ObjectInspector: FC = () => {
  const {creatorStore} = useStore();
  const {objectName, objectInfo, spawnAssetStore} = creatorStore;
  const {assets3dBasic, assets3dCustom} = spawnAssetStore;

  const canChangeColor = assets3dBasic.some((asset) => asset.id === objectInfo?.asset_3d_id);

  const actualObject =
    assets3dBasic.find((asset) => asset.id === objectInfo?.asset_3d_id) ||
    assets3dCustom.find((asset) => asset.id === objectInfo?.asset_3d_id);

  const actualObjectAsset = actualObject ? Asset3d.create({...actualObject}) : undefined;

  return (
    <styled.Container>
      <styled.Section>
        <Frame>
          <styled.ObjectName>{objectName}</styled.ObjectName>
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
      <styled.Section>
        <div>TODO transform inputs</div>
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
        <styled.Section>
          <ObjectColorPicker />
        </styled.Section>
      )}
    </styled.Container>
  );
};

export default observer(ObjectInspector);
