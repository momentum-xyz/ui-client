import {FC, useEffect, useRef, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {Button, Frame, IconSvg, TabInterface} from '@momentum-xyz/ui-kit';
import {useI18n, i18n} from '@momentum-xyz/core';

import {ToastContent} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {BasicAsset2dIdEnum} from 'core/enums';
import {subMenuKeyWidgetEnumMap} from 'core/constants';

import {AssignText, AssignImage, AssignVideo, AssignSound} from './components';
import * as styled from './ObjectFunction.styled';

const TABS_LIST: TabInterface<BasicAsset2dIdEnum>[] = [
  {id: BasicAsset2dIdEnum.IMAGE, icon: 'picture_upload', label: i18n.t('labels.addPicture')},
  {id: BasicAsset2dIdEnum.VIDEO, icon: 'video_upload', label: i18n.t('labels.addVideo')},
  {id: BasicAsset2dIdEnum.TEXT, icon: 'upload', label: i18n.t('labels.addText')}
];

const ObjectFunction: FC = () => {
  const {universeStore, widgetStore, widgetManagerStore} = useStore();
  const {creatorStore} = widgetStore;
  const {selectedTab, objectFunctionalityStore, selectedObjectId} = creatorStore;
  const {currentAssetId} = objectFunctionalityStore;
  const {objectStore} = universeStore;
  const {pluginLoader, objectContentStore} = objectStore;
  const {normalContent} = objectContentStore;

  const [activeType, setActiveType] = useState<string | null>(null);
  const actionRef = useRef<{doSave: () => void}>({doSave: () => {}});

  const {t} = useI18n();

  // TODO remove this and simplify the store
  useEffect(() => {
    if (selectedObjectId) {
      objectFunctionalityStore.init(selectedObjectId);
      objectStore.init(selectedObjectId);
    }

    return () => {
      objectFunctionalityStore.resetModel();
      objectStore.resetModel();
    };
  }, [selectedObjectId, objectFunctionalityStore, objectStore]);

  const availableTabs: TabInterface<BasicAsset2dIdEnum>[] = currentAssetId
    ? TABS_LIST.filter(({id}) => id === currentAssetId)
    : TABS_LIST;

  const handleSubMenuActiveChange = (): void => {
    const currentTabIsOnSubMenu = selectedTab && subMenuKeyWidgetEnumMap[selectedTab];
    if (currentTabIsOnSubMenu) {
      widgetManagerStore.setSubMenuActiveKeys([]);
    }
  };

  const handleSaved = async () => {
    //actionRef.current?.doSave();

    if (activeType) {
      objectFunctionalityStore.selectAsset(activeType);
      await objectFunctionalityStore.updateObject();
    }

    creatorStore.setSelectedTab(null);
    handleSubMenuActiveChange();
    toast.info(<ToastContent icon="check" text={t('messages.saved')} />);
  };

  const handleDelete = async () => {
    await objectFunctionalityStore.removeObjectFunctionality();

    creatorStore.setSelectedTab(null);
    handleSubMenuActiveChange();
    toast.info(<ToastContent icon="check" text={t('messages.deleted')} />);
  };

  const renderBody = () => {
    if (!activeType || !selectedObjectId) {
      return;
    }

    return (
      <styled.PanelBody>
        {/* ASSIGN IMAGE */}
        {activeType === BasicAsset2dIdEnum.IMAGE && (
          <AssignImage
            initialTitle={normalContent.title}
            initialImageSrc={normalContent.imageSrc}
            isEditing={!!currentAssetId}
            isPending={normalContent.isPending}
            onSave={async (file, title) => {
              await normalContent.postNewImage(selectedObjectId, file, title);
              await handleSaved();
            }}
            onBack={() => setActiveType(null)}
            onDelete={handleDelete}
          />
        )}

        {/* ASSIGN TEXT */}
        {activeType === BasicAsset2dIdEnum.TEXT && (
          <AssignText
            initialTitle={normalContent.content?.title}
            initialText={normalContent.content?.content}
            isEditing={!!currentAssetId}
            isPending={normalContent.isPending}
            onSave={async (title, content) => {
              await normalContent.postNewContent(selectedObjectId, {title, content});
              await handleSaved();
            }}
            onBack={() => setActiveType(null)}
            onDelete={handleDelete}
          />
        )}

        {/* ASSIGN VIDEO */}
        {activeType === BasicAsset2dIdEnum.VIDEO && (
          <>
            {pluginLoader?.plugin ? (
              <AssignVideo
                actionRef={actionRef}
                plugin={pluginLoader.plugin}
                pluginLoader={pluginLoader}
                objectId={selectedObjectId}
              />
            ) : (
              <div>
                <div>Cannot assign functionality because plugin_video is not loaded.</div>
                <div>Report to development.</div>
              </div>
            )}
          </>
        )}

        {/* ASSIGN SOUND */}
        {/* FIXME: Temp solutions. It will be moved to the new Inspector */}
        {activeType === 'sound' && (
          <AssignSound objectId={selectedObjectId} onBack={() => setActiveType(null)} />
        )}
      </styled.PanelBody>
    );
  };

  /* FIXME: TEMP. THIS IS CUSTOMIZABLE OBJECT */
  if (objectStore.asset2dId === BasicAsset2dIdEnum.CUSTOMIZABLE) {
    return (
      <styled.WarningContainer data-testid="ObjectFunction-test">
        <styled.WarningContainerInner>
          <Frame>
            <styled.Text>
              This object is customizable by visitors and can not be assigned any other custom
              functions.
            </styled.Text>
          </Frame>
        </styled.WarningContainerInner>
      </styled.WarningContainer>
    );
  }

  return (
    <styled.Container data-testid="ObjectFunction-test">
      {/* FUNCTION IS NOT SELECTED */}
      {!activeType && (
        <styled.AssignFunctionContainer>
          <styled.Title>{t('labels.assignFunctionToObjectTitle')}</styled.Title>
          <styled.Text>{t('labels.assignFunctionToObjectDescription')}</styled.Text>

          <styled.FunctionTypesContainer>
            {availableTabs.map((tab) => (
              <styled.FunctionType key={tab.id} onClick={() => setActiveType(tab.id)}>
                <IconSvg name={tab.icon} size="xll" isWhite />
                <styled.FunctionTypeTitle>{tab.label}</styled.FunctionTypeTitle>
              </styled.FunctionType>
            ))}
          </styled.FunctionTypesContainer>

          <styled.AssignAttribute>
            <Button
              wide
              icon="sound_add"
              label={t('actions.addSound')}
              onClick={() => setActiveType('sound')}
            />
          </styled.AssignAttribute>
        </styled.AssignFunctionContainer>
      )}

      {/* FUNCTION IS NOT SELECTED */}
      {activeType && !!selectedObjectId && (
        <>
          {renderBody()}

          {/*<styled.ActionBar>
            <Button
              variant="secondary"
              label={t('actions.back')}
              onClick={() => setActiveType(null)}
            />

            {currentAssetId && activeType !== 'sound' && (
              <Button variant="secondary" label={t('actions.delete')} onClick={handleDelete} />
            )}

            {!currentAssetId && activeType !== 'sound' && (
              <Button label={t('actions.embed')} onClick={handleSaved} />
            )}

            {currentAssetId && activeType !== 'sound' && (
              <Button label={t('actions.edit')} onClick={handleSaved} />
            )}
          </styled.ActionBar>*/}
        </>
      )}
    </styled.Container>
  );
};

export default observer(ObjectFunction);
