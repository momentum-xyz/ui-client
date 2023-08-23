import {FC, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {i18n, useI18n} from '@momentum-xyz/core';
import {Button, Input, TabInterface, Tabs} from '@momentum-xyz/ui-kit';
import {toast} from 'react-toastify';

import {useStore} from 'shared/hooks';
import {PosBusService} from 'shared/services';
import {ToastContent} from 'ui-kit';
import {PluginIdEnum} from 'api/enums';
import {BasicAsset2dIdEnum} from 'core/enums';

import {AssignSound} from '../ObjectFunction/components';
import {useAssignImage} from '../ObjectFunction/components/AssignImage/AssignImage';
import {useAssignVideo} from '../ObjectFunction/components/AssignVideo/AssignVideo';
import {useAssignText} from '../ObjectFunction/components/AssignText/AssignText';

import * as styled from './ObjectInspector.styled';
import {ObjectColorPicker, ObjectTransformForm} from './components';
import {TransformInterface} from './components/ObjectTransformForm/ObjectTransformForm';

type TabsType = 'settings' | 'info';

const TABS_LIST: TabInterface<TabsType>[] = [
  {id: 'settings', icon: 'gear', label: i18n.t('labels.settings')},
  {id: 'info', icon: 'info', label: i18n.t('labels.info')}
];

interface PropsInterface {
  objectId: string;
}

const ObjectInspector: FC<PropsInterface> = ({objectId}) => {
  const {widgetStore, universeStore} = useStore();
  const {creatorStore} = widgetStore;
  const {
    objectName,
    objectInfo,
    spawnAssetStore,
    // selectedObjectId,
    objectFunctionalityStore,
    saveObjectName
  } = creatorStore;
  const {assets3dBasic} = spawnAssetStore;
  const {objectStore} = universeStore;
  const {pluginLoader} = objectStore;

  const [activeTab, setActiveTab] = useState<TabsType>('settings');

  const {t} = useI18n();

  useEffect(() => {
    objectFunctionalityStore.init(objectId);
    objectStore.init(objectId);

    return () => {
      objectFunctionalityStore.resetModel();
      objectStore.resetModel();
    };
  }, [objectId, objectFunctionalityStore, objectStore]);

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

  // don't use debounce here, if different object is selected, it gets assigned prev object transform...
  const handleTransformChange = (data: TransformInterface) => {
    if (!objectId || !PosBusService.isConnected()) {
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
    PosBusService.sendObjectTransform(objectId, transform);
  };

  const {content: assignTextureContent, save: saveTexture} = useAssignImage({
    objectId,
    pluginId: PluginIdEnum.CORE,
    attributeName: 'texture',
    onChange: () => {
      console.log('textureContent onChange');
      saveTexture().catch((err) => {
        console.log('Error saving textureContent in inspector:', err);
        toast.error(<ToastContent isDanger icon="alert" text={t('assetsUploader.errorSave')} />);
      });
    }
  });

  const {
    content: assignImageContent,
    isModified: isModifiedImage,
    save: saveImage,
    discardChanges: discardImageChanges
  } = useAssignImage({objectId});

  const {
    content: assignVideoContent,
    isModified: isModifiedVideo,
    isValid: isValidVideo,
    save: saveVideo,
    discardChanges: discardVideoChanges
  } = useAssignVideo({
    objectId,
    plugin: pluginLoader?.plugin,
    pluginLoader
  });

  const {
    content: assignTextContent,
    isModified: isModifiedText,
    save: saveText,
    discardChanges: discardTextChanges
  } = useAssignText({objectId});

  const [modifiedObjectName, setModifiedObjectName] = useState<string>();
  const isEmptyNameSet = modifiedObjectName?.length === 0;

  const isModified =
    isModifiedImage || isModifiedVideo || isModifiedText || modifiedObjectName !== undefined;

  const isValid = isValidVideo && !isEmptyNameSet;

  const handleSaveInfo = async () => {
    try {
      objectFunctionalityStore.selectAsset(BasicAsset2dIdEnum.CONTENT);
      await objectFunctionalityStore.updateObject();

      // check if modified - here or internally
      await Promise.all([
        isModifiedImage && saveImage(),
        isModifiedVideo && saveVideo(),
        isModifiedText && saveText(),
        modifiedObjectName && saveObjectName(modifiedObjectName)
      ]);

      toast.info(<ToastContent icon="check" text={t('messages.saved')} />);
    } catch (err) {
      console.log('Error saving in inspector:', err);
      toast.error(<ToastContent isDanger icon="alert" text={t('assetsUploader.errorSave')} />);
    }
  };

  const handleDiscard = () => {
    discardImageChanges();
    discardVideoChanges();
    discardTextChanges();
    setModifiedObjectName(undefined);
  };

  return (
    <styled.Container data-testid="ObjectInspector-test">
      <styled.Tabs>
        <Tabs tabList={TABS_LIST} activeId={activeTab} onSelect={setActiveTab} />
      </styled.Tabs>

      {activeTab === 'settings' && (
        <>
          <styled.MainTitle>{objectName}</styled.MainTitle>
          {/* TODO  date */}

          <styled.Separator />

          {transformFormData && (
            <ObjectTransformForm
              // key={selectedObjectId}
              key={JSON.stringify(transformFormData)} // there's slight delay between selectedObjectId change and objectInfo change, so we need to use transformFormData as key
              initialData={transformFormData}
              onTransformChange={handleTransformChange}
            />
          )}

          <styled.Separator />

          <styled.Title>{t('titles.objectSound')}</styled.Title>

          <AssignSound objectId={objectId} onBack={() => {}} />

          <styled.Separator />

          <styled.Title>Wrap image around object</styled.Title>
          {assignTextureContent}

          <styled.Separator />

          {canChangeColor && (
            // <styled.Section className="color-picker">
            <>
              <styled.Title>{t('titles.colourPicker')}</styled.Title>
              <ObjectColorPicker />
            </>
            // </styled.Section>
          )}
        </>
      )}

      {activeTab === 'info' && (
        <>
          {/* owner name, date   */}
          <styled.MainTitle>{objectName}</styled.MainTitle>

          <styled.Separator />

          {assignImageContent}

          <styled.Separator />

          <styled.Title>Name of object</styled.Title>
          <Input
            value={modifiedObjectName ?? objectName}
            onChange={setModifiedObjectName}
            wide
            danger={isEmptyNameSet}
          />
          <styled.Title>Description of object</styled.Title>
          {assignTextContent}

          <styled.Separator />

          <styled.Title>Add video to object info</styled.Title>
          <styled.VideoWrapper>
            {pluginLoader?.plugin ? (
              // <AssignVideo
              //   objectId={objectId}
              //   plugin={pluginLoader.plugin}
              //   pluginLoader={pluginLoader}
              //   isEditing
              //   onDelete={() => {}}
              //   onSaved={() => {}}
              //   onBack={() => {}}
              // />
              assignVideoContent
            ) : (
              <div>
                <div>Cannot assign functionality because plugin_video is not loaded.</div>
                <div>Report to development.</div>
              </div>
            )}
          </styled.VideoWrapper>

          <styled.Separator />

          {isModified && (
            <styled.ActionBar>
              <Button label={t('actions.cancel')} onClick={handleDiscard} />
              <Button label={t('actions.submit')} disabled={!isValid} onClick={handleSaveInfo} />
            </styled.ActionBar>
          )}
        </>
      )}
    </styled.Container>
  );
};

export default observer(ObjectInspector);
