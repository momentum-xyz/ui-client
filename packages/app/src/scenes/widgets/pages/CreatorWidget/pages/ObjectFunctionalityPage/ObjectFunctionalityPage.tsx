import {FC, useEffect, useRef, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {Button, TabInterface, Tabs} from '@momentum-xyz/ui-kit';

import {ToastContent} from 'ui-kit';
import {BasicAsset2dIdEnum} from 'core/enums';
import {useStore} from 'shared/hooks';
import {subMenuKeyWidgetEnumMap} from 'core/constants';

import {AssignText, AssignImage, AssignVideoDialog} from './components';
import * as styled from './ObjectFunctionalityPage.styled';

const TABS_LIST: TabInterface<BasicAsset2dIdEnum>[] = [
  {id: BasicAsset2dIdEnum.IMAGE, icon: 'picture_upload', label: 'Picture'},
  {id: BasicAsset2dIdEnum.VIDEO, icon: 'video_upload', label: 'Video'},
  {id: BasicAsset2dIdEnum.TEXT, icon: 'upload', label: 'Text'}
];

const ObjectFunctionalityPage: FC = () => {
  const {universeStore, widgetStore, widgetManagerStore} = useStore();
  const {creatorStore} = widgetStore;
  const {selectedTab, objectFunctionalityStore, selectedObjectId} = creatorStore;
  const {objectStore} = universeStore;
  const {pluginLoader} = objectStore;

  const [modifiedOptionValue, setModifiedOptionValue] = useState<string | null>(null);

  const activeId = modifiedOptionValue || objectFunctionalityStore.currentAssetId;

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
              <AssignVideoDialog
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
    <styled.Container>
      <styled.HeadingWrapper>
        <Tabs tabList={TABS_LIST} activeId={activeId} onSelect={handleTypeChange} />
      </styled.HeadingWrapper>

      <styled.PanelBody>{renderBody()}</styled.PanelBody>

      {activeId && (
        <styled.ActionBar>
          <Button label="Embed" onClick={handleSave} />
        </styled.ActionBar>
      )}
    </styled.Container>
  );
};

export default observer(ObjectFunctionalityPage);
