/* eslint-disable @typescript-eslint/no-unused-vars */
import {FC, useEffect, useRef, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {Button, IconSvg, TabInterface, Tabs} from '@momentum-xyz/ui-kit';

import {ToastContent} from 'ui-kit';
import {BasicAsset2dIdEnum} from 'core/enums';
import {useStore} from 'shared/hooks';
import {subMenuKeyWidgetEnumMap} from 'core/constants';

import {AssignText, AssignImage, AssignVideo} from './components';
import * as styled from './ObjectFunction.styled';

const TABS_LIST: TabInterface<BasicAsset2dIdEnum>[] = [
  {id: BasicAsset2dIdEnum.IMAGE, icon: 'picture_upload', label: 'Add a picture'},
  {id: BasicAsset2dIdEnum.VIDEO, icon: 'video_upload', label: 'Add a video'},
  {id: BasicAsset2dIdEnum.TEXT, icon: 'upload', label: 'Add a text'}
];

const ObjectFunction: FC = () => {
  const {universeStore, widgetStore, widgetManagerStore} = useStore();
  const {creatorStore} = widgetStore;
  const {selectedTab, objectFunctionalityStore, selectedObjectId} = creatorStore;
  const {objectStore} = universeStore;
  const {pluginLoader} = objectStore;

  const [modifiedOptionValue, setModifiedOptionValue] = useState<string | null>(null);

  const activeId = modifiedOptionValue;

  const tabs: TabInterface<BasicAsset2dIdEnum>[] = objectFunctionalityStore.currentAssetId
    ? TABS_LIST.filter((tab) => tab.id === objectFunctionalityStore.currentAssetId)
    : TABS_LIST;

  const actionRef = useRef<{doSave: () => void}>({doSave: () => {}});

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

      toast.info(<ToastContent icon="check" text="Saved" />);
    } catch (e) {
      console.log(e);
      toast.error(<ToastContent icon="alert" text="Error saving" />);
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
          <styled.Title>Assign a function to the object</styled.Title>
          <styled.Text>
            By embedding a picture, text, video or sound you change the function of this object;
            users can see an image wrapped around the object or hear a sound when they fly towards
            the object. Users will also be able to see the text, image or video displayed when they
            select the object; regardless of its asset type.
          </styled.Text>
          <styled.FunctionTypesContainer>
            {tabs.map((tab) => (
              <styled.FunctionType key={tab.id} onClick={() => handleTypeChange(tab.id)}>
                <IconSvg name={tab.icon} size="xll" isWhite />
                <styled.FunctionTypeTitle>{tab.label}</styled.FunctionTypeTitle>
              </styled.FunctionType>
            ))}
          </styled.FunctionTypesContainer>
        </styled.AssignFunctionContainer>
      )}
      <styled.PanelBody>{renderBody()}</styled.PanelBody>

      {activeId && (
        <styled.ActionBar>
          <Button label="Back" variant="secondary" onClick={() => setModifiedOptionValue(null)} />
          <Button label="Embed" onClick={handleSave} />
        </styled.ActionBar>
      )}
    </styled.Container>
  );
};

export default observer(ObjectFunction);
