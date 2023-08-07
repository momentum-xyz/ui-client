import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Model3dPreview} from '@momentum-xyz/core3d';
import {useI18n} from '@momentum-xyz/core';
import {Frame} from '@momentum-xyz/ui-kit';

import {Asset3d} from 'core/models';
import {useStore} from 'shared/hooks';
import {PosBusService} from 'shared/services';

import * as styled from './ObjectInspector.styled';
import {ObjectColorPicker, ObjectTransformForm} from './components';
import {TransformInterface} from './components/ObjectTransformForm/ObjectTransformForm';

const ObjectInspector: FC = () => {
  const {widgetStore} = useStore();
  const {creatorStore} = widgetStore;
  const {objectName, objectInfo, spawnAssetStore, selectedObjectId} = creatorStore;
  const {assets3dBasic, assets3dCustom} = spawnAssetStore;

  const {t} = useI18n();

  const transformFormData: TransformInterface | null = objectInfo?.transform
    ? {
        positionX: objectInfo.transform.position.x,
        positionY: objectInfo.transform.position.y,
        positionZ: objectInfo.transform.position.z,
        rotationX: objectInfo.transform.rotation.x,
        rotationY: objectInfo.transform.rotation.y,
        rotationZ: objectInfo.transform.rotation.z,
        scaleX: objectInfo.transform.scale.x,
        scaleY: objectInfo.transform.scale.y,
        scaleZ: objectInfo.transform.scale.z
      }
    : null;

  const canChangeColor = assets3dBasic.some((asset) => asset.id === objectInfo?.asset_3d_id);

  const actualObject =
    assets3dBasic.find((asset) => asset.id === objectInfo?.asset_3d_id) ||
    assets3dCustom.find((asset) => asset.id === objectInfo?.asset_3d_id);

  const actualObjectAsset = actualObject ? Asset3d.create({...actualObject}) : undefined;

  // don't use debounce here, if different object is selected, it gets assigned prev object transform...
  const handleTransformChange = (data: TransformInterface) => {
    if (!selectedObjectId || !PosBusService.isConnected()) {
      console.log(`ObjectInspectorPage: PosBusService is not connected.`);
      return;
    }
    const transform = {
      position: {
        x: data.positionX,
        y: data.positionY,
        z: data.positionZ
      },
      rotation: {
        x: data.rotationX,
        y: data.rotationY,
        z: data.rotationZ
      },
      scale: {
        x: data.scaleX,
        y: data.scaleY,
        z: data.scaleZ
      }
    };
    PosBusService.sendObjectTransform(selectedObjectId, transform);
  };

  return (
    <styled.Container data-testid="ObjectInspector-test">
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
      {transformFormData && (
        <ObjectTransformForm
          // key={selectedObjectId}
          key={JSON.stringify(transformFormData)} // there's slight delay between selectedObjectId change and objectInfo change, so we need to use transformFormData as key
          initialData={transformFormData}
          onTransformChange={handleTransformChange}
        />
      )}
      {canChangeColor && (
        <styled.Section className="color-picker">
          <styled.Title>{t('titles.colourPicker')}</styled.Title>
          <ObjectColorPicker />
        </styled.Section>
      )}
    </styled.Container>
  );
};

export default observer(ObjectInspector);
