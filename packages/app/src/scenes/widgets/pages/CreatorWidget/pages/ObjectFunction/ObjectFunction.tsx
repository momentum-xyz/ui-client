/* eslint-disable @typescript-eslint/no-unused-vars */
import {FC, useEffect, useRef, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {Button, IconSvg, TabInterface, Tabs} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {ToastContent} from 'ui-kit';
import {BasicAsset2dIdEnum} from 'core/enums';
import {useStore} from 'shared/hooks';
import {subMenuKeyWidgetEnumMap} from 'core/constants';

import {AssignText, AssignImage, AssignVideo} from './components';
import * as styled from './ObjectFunction.styled';

const ObjectFunction: FC = () => {
  const {universeStore, widgetStore, widgetManagerStore} = useStore();
  const {creatorStore} = widgetStore;
  const {selectedTab, objectFunctionalityStore, selectedObjectId} = creatorStore;
  const {objectStore} = universeStore;
  const {pluginLoader} = objectStore;

  const {t} = useI18n();

  const [modifiedOptionValue, setModifiedOptionValue] = useState<string | null>(null);

  const activeId = modifiedOptionValue;

  const TABS_LIST: TabInterface<BasicAsset2dIdEnum>[] = [
    {id: BasicAsset2dIdEnum.IMAGE, icon: 'picture_upload', label: t('labels.addPicture')},
    {id: BasicAsset2dIdEnum.VIDEO, icon: 'video_upload', label: t('labels.addVideo')},
    {id: BasicAsset2dIdEnum.TEXT, icon: 'upload', label: t('labels.addText')}
  ];

  const tabs: TabInterface<BasicAsset2dIdEnum>[] = objectFunctionalityStore.currentAssetId
    ? TABS_LIST.filter((tab) => tab.id === objectFunctionalityStore.currentAssetId)
    : TABS_LIST;

  const actionRef = useRef<{doSave: () => void}>({
    doSave: () => {}
  });

  console.log('ObjectFunctionalityPage', {
    selectedObjectId,
    modifiedOptionValue,
    currentAssetId: objectFunctionalityStore.currentAssetId
  });

  // TODO remove this and simplify the store
  useEffect(() => {
    if (selectedObjectId) {
      objectFunctionalityStore.init(selectedObjectId);
      objectStore.init(selectedObjectId);
    }

    return () => {
      objectFunctionalityStore.resetModel();
    };
  }, [selectedObjectId, objectFunctionalityStore, objectStore]);

  const handleSubMenuActiveChange = (): void => {
    const currentTabIsOnSubMenu = selectedTab && subMenuKeyWidgetEnumMap[selectedTab];
    if (currentTabIsOnSubMenu) {
      widgetManagerStore.setSubMenuActiveKeys([]);
    }
  };

  const handleSave = async () => {
    try {
      actionRef.current?.doSave();

      if (modifiedOptionValue) {
        objectFunctionalityStore.selectAsset(modifiedOptionValue);
        await objectFunctionalityStore.updateObject();
      }

      creatorStore.setSelectedTab(null);
      handleSubMenuActiveChange();

      toast.info(<ToastContent icon="check" text={t('labels.saved')} />);
    } catch (e) {
      console.log(e);
      toast.error(<ToastContent icon="alert" text={t('labels.errorSaving')} />);
    }
  };

  const handleDelete = async () => {
    try {
      await objectFunctionalityStore.removeObjectFunctionality();

      creatorStore.setSelectedTab(null);
      handleSubMenuActiveChange();

      toast.info(<ToastContent icon="check" text={t('labels.deleted')} />);
    } catch (e) {
      console.log(e);
      toast.error(<ToastContent icon="alert" text={t('labels.errorDeleting')} />);
    }
  };

  const handleTypeChange = (value: string) => {
    console.log('handleTypeChange', value);
    setModifiedOptionValue(value);
  };

  const renderBody = () => {
    if (!selectedObjectId) {
      return null;
    }

    switch (activeId) {
      case BasicAsset2dIdEnum.IMAGE:
        return <AssignImage actionRef={actionRef} objectId={selectedObjectId} />;
      case BasicAsset2dIdEnum.TEXT:
        return <AssignText actionRef={actionRef} objectId={selectedObjectId} />;
      case BasicAsset2dIdEnum.VIDEO:
        return (
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
                Cannot assign functionality because plugin_video is not loaded. Report to
                development.
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <styled.Container data-testid="ObjectFunction-test">
      {!activeId && (
        <styled.AssignFunctionContainer>
          <styled.Title>{t('labels.assignFunctionToObjectTitle')}</styled.Title>
          <styled.Text>{t('labels.assignFunctionToObjectDescription')}</styled.Text>
          <styled.FunctionTypesContainer>
            {tabs.map((tab) => (
              <styled.FunctionType key={tab.id} onClick={() => handleTypeChange(tab.id)}>
                <IconSvg name={tab.icon} size="xll" isWhite />
                <styled.FunctionTypeTitle>{tab.label}</styled.FunctionTypeTitle>
              </styled.FunctionType>
            ))}
          </styled.FunctionTypesContainer>

          <styled.AssignAttribute>
            <Button wide icon="sound_add" label={t('actions.addSound')} />
          </styled.AssignAttribute>
        </styled.AssignFunctionContainer>
      )}
      <styled.PanelBody>{renderBody()}</styled.PanelBody>

      {activeId && (
        <styled.ActionBar>
          <Button
            label={t('actions.back')}
            variant="secondary"
            onClick={() => setModifiedOptionValue(null)}
          />
          {objectFunctionalityStore.currentAssetId ? (
            <Button label={t('actions.delete')} onClick={handleDelete} />
          ) : (
            <Button label={t('actions.embed')} onClick={handleSave} />
          )}
        </styled.ActionBar>
      )}
    </styled.Container>
  );
};

export default observer(ObjectFunction);
